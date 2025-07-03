import logging
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.foundation.disclosure_service_client import DisclosureServiceClient
from app.domain.repository.report_repository import ReportRepository
from app.domain.model.report_entity import ReportTemplate
from app.domain.generators.text_generator import TextGenerator

logger = logging.getLogger(__name__)

class ReportService:
    """보고서 생성을 담당하는 서비스 클래스"""
    
    def __init__(
        self,
        report_repository: ReportRepository,
        disclosure_client: DisclosureServiceClient,
        text_generator: TextGenerator
    ):
        """
        ReportService 생성자
        
        Args:
            report_repository (ReportRepository): 보고서 템플릿 리포지토리
            disclosure_client (DisclosureServiceClient): 공시 서비스 클라이언트
            text_generator (TextGenerator): 텍스트 생성기
        """
        self.report_repository = report_repository
        self.disclosure_client = disclosure_client
        self.text_generator = text_generator
        logger.info("ReportService 초기화 완료 (Batch-enabled TextGenerator)")

    async def generate_report(self, user_id: str, db: Session) -> List[Dict[str, Any]]:
        # 1. 데이터 수집 (기존과 동일)
        logger.info(f"사용자 ID({user_id})에 대한 보고서 생성 시작")
        report_templates = self.report_repository.find_all_ordered_by_content_order(db)
        if not report_templates:
            logger.warning("보고서 템플릿이 DB에 존재하지 않습니다.")
            return []
        
        user_answers = await self.disclosure_client.get_my_answers(user_id)
        
        answers_dict = {}
        if user_answers:
            for answer in user_answers:
                # 여러 answer_value_ 필드 중 실제 값이 있는 것을 찾음
                actual_value = (
                    answer.get('answer_value_text') or
                    answer.get('answer_value_number') or
                    answer.get('answer_value_boolean') or
                    answer.get('answer_value_json') or
                    answer.get('answer_value_date')
                )
                # requirement_id를 키로, 실제 답변 값을 값으로 하는 딕셔너리 생성
                answers_dict[answer['requirement_id']] = actual_value
        logger.info("사용자 답변 데이터를 딕셔너리 형태로 변환 완료.")
        
        logger.info(f"템플릿 {len(report_templates)}개, 답변 {len(answers_dict)}개 수집 완료")

        # 2. 텍스트 생성이 필요한 템플릿만 필터링
        paragraph_templates = [
            t for t in report_templates 
            if t.content_type == 'PARAGRAPH' and t.slm_prompt_template
        ]

        # 3. 단 한 번의 호출로 모든 문단 생성
        generated_paragraphs = await self.text_generator.generate_all_paragraphs(
            paragraph_templates, answers_dict
        )
        logger.info(f"일괄 처리로 {len(generated_paragraphs)}개의 문단 생성 완료")

        # 4. 최종 보고서 조립
        report_contents: List[Dict[str, Any]] = []
        for template in report_templates:
            # 🚨 이제 user_answers 대신 변환된 answers_dict를 전달
            content_item = await self._generate_content_item(template, answers_dict, generated_paragraphs)
            if content_item:
                report_contents.append(content_item)

        logger.info(f"보고서 생성 완료. 총 {len(report_contents)}개의 콘텐츠 항목 생성됨.")
        return report_contents

    async def _generate_content_item(
        self, 
        template: ReportTemplate, 
        answers: Dict[str, Any],
        generated_paragraphs: Dict[str, str]
    ) -> Optional[Dict[str, Any]]:
        """템플릿과 생성된 텍스트를 기반으로 최종 보고서 콘텐츠 항목을 생성합니다."""
        content_type = template.content_type
        
        if content_type == 'PARAGRAPH':
            content = generated_paragraphs.get(template.report_content_id, "오류: 해당 문단을 생성하지 못했습니다.")
            return {"type": "paragraph", "content": content}
        
        elif content_type == 'STATIC_PARAGRAPH':
            final_content = template.content_template or ""

            # 템플릿이 치환할 데이터를 필요로 하는지 확인 (source_requirement_ids가 비어있지 않은 경우)
            if template.source_requirement_ids:
                # 첫 번째 source_id를 가져옴 (gen-1)
                source_id = template.source_requirement_ids[0]
                source_data = answers.get(source_id)

                # 답변 데이터가 정상적인 딕셔너리 형태인지 확인 (structured_list는 리스트 안에 딕셔너리가 있음)
                data_to_fill = None
                if isinstance(source_data, list) and source_data:
                    data_to_fill = source_data[0]
                elif isinstance(source_data, dict):
                    data_to_fill = source_data

                if data_to_fill:
                    # 플레이스홀더 (예: {{company_name}}) 를 실제 값으로 치환
                    for key, value in data_to_fill.items():
                        final_content = final_content.replace(f"{{{{{key}}}}}", str(value))
                else:
                    logger.warning(f"정적 콘텐츠 '{template.report_content_id}'의 소스 데이터 '{source_id}'를 찾을 수 없거나 형식이 다릅니다.")

            # source_requirement_ids가 없는 템플릿은 그대로 final_content가 반환됨
            return {"type": "paragraph", "content": final_content}
        
        elif content_type in ['HEADING_1', 'HEADING_2', 'HEADING_3', 'HEADING_4']:
            return {"type": content_type.lower(), "content": template.content_template}

        elif content_type == 'TABLE':
            # 테이블 생성 로직은 여기에 구현될 수 있습니다.
            # 지금은 플레이스홀더를 반환합니다.
            return {"type": "table", "content": "테이블 생성 미구현"} 
        
        else:
            logger.warning(f"알 수 없는 콘텐츠 유형입니다: '{content_type}'")
            return None

    def _extract_answer_value(self, answer: Dict[str, Any]) -> Any:
        """답변 딕셔너리에서 실제 값 추출"""
        return (
            answer.get('answer_value_text') or
            answer.get('answer_value_number') or
            answer.get('answer_value_boolean') or
            answer.get('answer_value_json') or
            answer.get('answer_value_date')
        )

    def _template_to_dict(self, template: ReportTemplate) -> Dict[str, Any]:
        """
        ReportTemplate 객체를 딕셔너리로 변환
        
        Args:
            template (ReportTemplate): 보고서 템플릿 객체
            
        Returns:
            Dict[str, Any]: 템플릿 데이터 딕셔너리
        """
        return {
            "report_content_id": template.report_content_id,
            "section_kr": template.section_kr,
            "content_order": template.content_order,
            "depth": template.depth,
            "content_type": template.content_type,
            "content_template": template.content_template,
            "source_requirement_ids": template.source_requirement_ids,
            "slm_prompt_template": template.slm_prompt_template
        }
    
    def get_templates_by_section(self, db: Session, section_kr: str) -> List[ReportTemplate]:
        """
        특정 섹션의 보고서 템플릿 조회
        
        Args:
            section_kr (str): 섹션명 (한국어)
            
        Returns:
            List[ReportTemplate]: 해당 섹션의 템플릿 목록
        """
        try:
            return self.report_repository.find_by_section_kr(db, section_kr)
        except Exception as e:
            logger.error(f"섹션별 템플릿 조회 실패 (섹션: {section_kr}): {e}")
            return []
    
    def get_template_by_id(self, db: Session, report_content_id: str) -> Optional[ReportTemplate]:
        """
        특정 ID의 보고서 템플릿 조회
        
        Args:
            report_content_id (str): 보고서 콘텐츠 ID
            
        Returns:
            Optional[ReportTemplate]: 조회된 템플릿 또는 None
        """
        try:
            return self.report_repository.find_by_report_content_id(db, report_content_id)
        except Exception as e:
            logger.error(f"템플릿 조회 실패 (ID: {report_content_id}): {e}")
            return None 