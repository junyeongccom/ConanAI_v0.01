import logging
import json
from typing import Dict, Any, Optional, List

from app.platform.slm_client import SLMClient
from app.domain.model.report_entity import ReportTemplate

logger = logging.getLogger(__name__)

class TextGenerator:
    """SLM을 사용하여 여러 서술형 문단을 일괄 생성하는 생성기"""

    def __init__(self, slm_client: SLMClient):
        """
        TextGenerator를 초기화합니다.

        Args:
            slm_client: 외부 SLM API와 통신하는 클라이언트 인스턴스
        """
        if not isinstance(slm_client, SLMClient):
            raise TypeError("slm_client는 SLMClient의 인스턴스여야 합니다.")
        self.slm_client = slm_client
        logger.info("TextGenerator (Batch-enabled) 초기화 완료.")

    async def generate_all_paragraphs(
        self, templates: List[ReportTemplate], answers: Dict[str, Any]
    ) -> Dict[str, str]:
        """
        여러 템플릿에 대한 프롬프트를 하나의 마스터 프롬프트로 묶어
        SLM에 단 한 번만 요청하고, 결과 JSON을 파싱하여 반환합니다.

        Args:
            templates: PARAGRAPH 타입의 ReportTemplate 목록
            answers: 사용자의 모든 답변을 담은 딕셔너리

        Returns:
            { "report_content_id": "생성된 문단", ... } 형식의 딕셔너리
        """
        if not templates:
            return {}

        master_prompt = self._build_master_prompt(templates, answers)
        if not master_prompt:
            logger.warning("생성할 프롬프트가 없어 SLM 호출을 생략합니다.")
            return {}
        
        logger.info(f"SLM에 전달할 마스터 프롬프트 생성 완료. 총 {len(templates)}개 문단 요청.")
        logger.debug(f"마스터 프롬프트 내용 (일부): {master_prompt[:500]}...")

        raw_text = await self.slm_client.generate_text(master_prompt)

        if not raw_text:
            logger.error("SLM으로부터 빈 응답을 받았습니다.")
            return {t.report_content_id: "오류: SLM 응답 없음" for t in templates}
        
        # SLM 응답이 마크다운 코드 블록으로 감싸져 오는 경우를 처리
        json_str = raw_text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:].strip() # "```json" 제거 및 공백 제거
        if json_str.endswith("```"):
            json_str = json_str[:-3].strip() # "```" 제거 및 공백 제거

        try:
            # 정제된 JSON 문자열을 파싱
            result_dict = json.loads(json_str)
            logger.info(f"일괄 처리로 {len(result_dict)}개의 문단 생성 완료.")
            return result_dict
        except json.JSONDecodeError:
            logger.error(f"SLM이 반환한 텍스트가 유효한 JSON이 아닙니다: {raw_text}")
            return {t.report_content_id: "오류: SLM 응답 형식 오류" for t in templates}

    def _build_master_prompt(self, templates: List[ReportTemplate], answers: Dict[str, Any]) -> str:
        """개별 프롬프트를 모아 하나의 거대한 마스터 프롬프트를 생성합니다."""
        
        individual_prompts = []
        for t in templates:
            # _build_prompt는 개별 프롬프트 생성에 재사용
            prompt = self._build_prompt(t.slm_prompt_template, t.source_requirement_ids, answers)
            # JSON 키와 프롬프트를 이스케이프 처리하여 템플릿에 삽입
            individual_prompts.append(f'"{t.report_content_id}": "{self._escape_for_json(prompt)}"')

        # 최종 JSON 출력을 지시하는 마스터 프롬프트 템플릿
        # 이 부분은 사용하는 LLM의 특성에 맞게 고도로 튜닝되어야 합니다.
        master_prompt_template = f"""
        당신은 ESG 보고서 작성을 전문으로 하는 AI 어시스턴트입니다.
        아래에 각 보고서 항목 ID에 해당하는 여러 개의 지시사항(프롬프트)이 주어집니다.
        각 지시사항을 독립적으로 수행하여, 최종 결과를 반드시 아래와 같은 JSON 형식으로만 반환해 주세요.
        JSON의 각 키는 보고서 항목 ID여야 하고, 각 값은 해당 지시사항에 따라 생성된 문단이어야 합니다.
        다른 설명이나 추가적인 텍스트 없이, 오직 JSON 객체만 출력해야 합니다.

        {{
          {", ".join(individual_prompts)}
        }}
        """
        return master_prompt_template.strip()

    def _build_prompt(self, prompt_template: str, source_ids: Optional[list[str]], answers: Dict[str, Any]) -> str:
        """프롬프트 템플릿의 플레이스홀더를 실제 답변으로 채우는 내부 메소드"""
        final_prompt = prompt_template
        
        if not source_ids:
            return final_prompt
            
        for req_id in source_ids:
            placeholder = f"{{{{answer_{req_id}}}}}"  # 예: {{answer_gov-1}}
            
            is_json_type = req_id.endswith('_json')
            actual_req_id = req_id.removesuffix('_json') if is_json_type else req_id

            answer_data = answers.get(actual_req_id)

            answer_str = self._format_answer(answer_data, is_json_type)
            
            final_prompt = final_prompt.replace(placeholder, answer_str)

        return final_prompt

    def _format_answer(self, answer_data: Any, is_json: bool) -> str:
        """답변 데이터를 프롬프트에 삽입할 문자열로 변환합니다."""
        if answer_data is None:
            return "(답변 없음)"
            
        if is_json:
            try:
                # 복잡한 JSON 구조를 보기 좋게 문자열로 변환
                return json.dumps(answer_data, ensure_ascii=False, indent=2)
            except (TypeError, ValueError):
                logger.warning(f"JSON 직렬화 실패: {answer_data}")
                return str(answer_data)
        
        return str(answer_data)

    def _escape_for_json(self, s: str) -> str:
        """JSON 문자열 내부에 안전하게 삽입될 수 있도록 프롬프트를 이스케이프 처리합니다."""
        return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t') 