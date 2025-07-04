import json
import logging
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from uuid import UUID
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS
from datetime import datetime

from app.foundation.disclosure_service_client import DisclosureServiceClient
from app.domain.repository.report_repository import ReportRepository
from app.domain.model.report_entity import ReportTemplate, Report
from app.domain.model.report_schema import SavedReportCreate, SavedReportUpdate
from app.domain.generators.text_generator import TextGenerator
from app.domain.generators.table_generator import TableGenerator

logger = logging.getLogger(__name__)

class ReportService:
    """보고서 생성을 담당하는 서비스 클래스"""
    
    def __init__(
        self,
        report_repository: ReportRepository,
        disclosure_client: DisclosureServiceClient,
        text_generator: TextGenerator,
        table_generator: TableGenerator
    ):
        """
        ReportService 생성자
        
        Args:
            report_repository (ReportRepository): 보고서 템플릿 리포지토리
            disclosure_client (DisclosureServiceClient): 공시 서비스 클라이언트
            text_generator (TextGenerator): 텍스트 생성기
            table_generator (TableGenerator): 테이블 생성기
        """
        self.report_repository = report_repository
        self.disclosure_client = disclosure_client
        self.text_generator = text_generator
        self.table_generator = table_generator
        # Jinja2 환경 설정
        self.jinja_env = Environment(loader=FileSystemLoader('app/templates/'))
        logger.info("ReportService 초기화 완료 (Jinja2, Text/Table Generators 탑재)")

    # --- PDF Generation Method ---
    def generate_report_pdf(self, db: Session, report_id: UUID, user_id: UUID) -> Optional[bytes]:
        """지정된 보고서 ID에 대한 PDF를 생성합니다."""
        logger.info(f"PDF 생성 시작: report_id={report_id}")
        
        # 1. 보고서 데이터 조회
        report = self.get_saved_report_detail(db, report_id, user_id)
        if not report:
            logger.warning(f"PDF 생성을 위한 보고서를 찾을 수 없음: report_id={report_id}")
            return None

        # 2. 데이터를 섹션별로 그룹화
        # ReportTemplate에서 section_kr 정보를 가져와서 report_data를 재구성
        all_templates = self.report_repository.find_all_ordered_by_content_order(db)
        template_sections = {t.report_content_id: t.section_kr for t in all_templates}

        sections_data = {}
        for item in report.report_data:
            # item['content']['title'] 등을 기준으로 section을 찾기보다,
            # 원본 템플릿의 ID-섹션 매핑을 사용하는 것이 더 안정적일 수 있습니다.
            # 여기서는 간단하게 제목을 기반으로 섹션을 추정합니다.
            # 실제 구현에서는 더 견고한 매핑이 필요합니다.
            if item['type'].startswith('heading_'):
                # 간단한 예시: heading_2를 섹션 제목으로 간주
                if item['type'] == 'heading_2':
                    section_title = item['content']
                    if section_title not in sections_data:
                        sections_data[section_title] = []
                # 현재 섹션에 콘텐츠 추가
                current_section = list(sections_data.keys())[-1] if sections_data else "기타"
                if current_section != item['content']:
                    sections_data.setdefault(current_section, []).append(item)
            else:
                 current_section = list(sections_data.keys())[-1] if sections_data else "기타"
                 sections_data.setdefault(current_section, []).append(item)
        
        # Jinja2 템플릿에 전달할 최종 데이터 구조
        sections_for_template = [{"title": title, "content": content} for title, content in sections_data.items()]


        # 3. HTML 템플릿 렌더링
        template = self.jinja_env.get_template('report_pdf_template.html')
        
        # 날짜 포맷팅 추가
        created_at_dt = datetime.fromisoformat(report.created_at.isoformat())

        render_data = {
            "report": {
                "title": report.title,
                "created_at_formatted": created_at_dt.strftime("%Y"),
            },
            "sections": sections_for_template,
        }
        html_content = template.render(render_data)

        # 4. WeasyPrint로 PDF 생성
        try:
            # CSS 파일 경로를 명시적으로 전달
            css_path = 'app/templates/report_pdf_style.css'
            pdf_bytes = HTML(string=html_content, base_url='.').write_pdf(stylesheets=[CSS(css_path)])
            logger.info(f"PDF 생성 완료: report_id={report_id}, size={len(pdf_bytes)} bytes")
            return pdf_bytes
        except Exception as e:
            logger.error(f"PDF 생성 중 오류 발생: {e}", exc_info=True)
            return None


    # --- Saved Report Service Methods ---

    def create_saved_report(self, db: Session, user_id: UUID, report_create: SavedReportCreate) -> Report:
        logger.info(f"사용자 ID({user_id})의 새 보고서 저장 시작: 제목='{report_create.title}'")
        return self.report_repository.create_report(db, user_id, report_create)

    def get_saved_reports_for_user(self, db: Session, user_id: UUID) -> List[Report]:
        logger.info(f"사용자 ID({user_id})의 저장된 보고서 목록 조회")
        return self.report_repository.find_reports_by_user_id(db, user_id)

    def get_saved_report_detail(self, db: Session, report_id: UUID, user_id: UUID) -> Optional[Report]:
        logger.info(f"사용자 ID({user_id})의 보고서(ID: {report_id}) 상세 정보 조회")
        return self.report_repository.find_report_by_id(db, report_id, user_id)

    def update_report(self, db: Session, report_id: UUID, report_update: SavedReportUpdate, user_id: UUID) -> Optional[Report]:
        logger.info(f"사용자 ID({user_id})의 보고서(ID: {report_id}) 업데이트")
        return self.report_repository.update_report(db, report_id, user_id, report_update.model_dump(exclude_unset=True))

    def delete_saved_report(self, db: Session, report_id: UUID, user_id: UUID) -> bool:
        logger.info(f"사용자 ID({user_id})의 보고서(ID: {report_id}) 삭제")
        return self.report_repository.delete_report(db, report_id, user_id)

    # --- Report Generation Methods ---

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
            content_item = await self._generate_content_item(template, answers_dict, generated_paragraphs)
            if content_item:
                report_contents.append(content_item)

        logger.info(f"보고서 생성 완료. 총 {len(report_contents)}개의 콘텐츠 항목 생성됨.")
        return report_contents

    async def _generate_content_item(
        self, 
        template: ReportTemplate, 
        answers_dict: Dict[str, Any],
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
                source_data = answers_dict.get(source_id)

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
            empty_table = {"type": "table", "content": {"title": template.content_template, "headers": [], "rows": []}}
            if not template.source_requirement_ids:
                logger.warning(f"테이블 템플릿 '{template.report_content_id}'에 source_requirement_ids가 없습니다.")
                return empty_table

            # --- Joined Table 감지 로직 ---
            driver_id = None
            driver_req_info = None
            # source_requirement_ids를 순회하며 'source_requirement' 키를 가진 '드라이버' 요구사항을 찾습니다.
            for req_id in template.source_requirement_ids:
                req_info = await self.disclosure_client.get_requirement_by_id(req_id)
                if req_info and req_info.get('input_schema', {}).get('source_requirement'):
                    driver_id = req_id
                    driver_req_info = req_info
                    break  # 첫 번째 드라이버를 찾으면 중단

            table_content = None
            # --- 드라이버 발견 시: Joined Table 생성 로직 실행 ---
            if driver_id and driver_req_info:
                logger.info(f"'{driver_id}'를 드라이버로 하는 Joined Table 생성을 시작합니다.")
                input_schema = driver_req_info.get('input_schema')
                
                # 드라이버 요구사항에 대한 답변을 파싱
                driver_answer_value = answers_dict.get(driver_id)
                parsed_driver_answer_data = None
                if driver_answer_value:
                    if isinstance(driver_answer_value, str) and driver_answer_value:
                        try:
                            parsed_driver_answer_data = json.loads(driver_answer_value)
                        except json.JSONDecodeError:
                            logger.error(f"Joined Table의 드라이버 데이터 JSON 파싱 실패: id='{driver_id}'")
                    else:
                        parsed_driver_answer_data = driver_answer_value

                # 새로운 joined_table 생성기 호출 (전체 답변 딕셔너리를 전달)
                table_content = await self.table_generator.generate_joined_table(
                    template,
                    parsed_driver_answer_data,
                    answers_dict,
                    input_schema
                )
            
            # --- 드라이버 미발견 시: 기존 테이블 생성 로직 실행 ---
            else:
                primary_source_id = template.source_requirement_ids[0]
                requirement_info = await self.disclosure_client.get_requirement_by_id(primary_source_id)
                if not requirement_info:
                    logger.error(f"Requirement 정보를 찾을 수 없습니다: id='{primary_source_id}'")
                    return empty_table

                # 답변 데이터 파싱
                parsed_answer_data = None
                answer_value = answers_dict.get(primary_source_id)
                if answer_value:
                    if isinstance(answer_value, str) and answer_value:
                        try:
                            parsed_answer_data = json.loads(answer_value)
                        except json.JSONDecodeError:
                            logger.error(f"테이블 데이터 JSON 파싱 실패: requirement_id='{primary_source_id}'")
                    else:
                        parsed_answer_data = answer_value

                input_type = requirement_info.get('data_required_type')
                input_schema = requirement_info.get('input_schema')

                if not input_schema and input_type in ['table_input', 'internal_carbon_price_input', 'ghg_emissions_input']:
                    logger.error(f"테이블 생성을 위한 input_schema를 찾을 수 없습니다: id='{primary_source_id}'")
                    return empty_table
                
                if input_type == 'quantitative_target_input':
                    logger.info(f"'{primary_source_id}'는 quantitative_target_input 타입이므로 generate_quantitative_target_table을 호출합니다.")
                    table_content = await self.table_generator.generate_quantitative_target_table(
                        template, parsed_answer_data
                    )
                elif input_type == 'internal_carbon_price_input':
                    logger.info(f"'{primary_source_id}'는 internal_carbon_price_input 타입이므로 generate_internal_carbon_price_table을 호출합니다.")
                    table_content = await self.table_generator.generate_internal_carbon_price_table(
                        template, parsed_answer_data, input_schema
                    )
                elif input_type == 'ghg_emissions_input':
                    logger.info(f"'{primary_source_id}'는 ghg_emissions_input 타입이므로 generate_ghg_table을 호출합니다.")
                    table_content = await self.table_generator.generate_ghg_table(
                        template, parsed_answer_data, input_schema
                    )
                elif input_type == 'ghg_gases_input':
                    logger.info(f"'{primary_source_id}'는 ghg_gases_input 타입이므로 generate_ghg_gases_table을 호출합니다.")
                    table_content = await self.table_generator.generate_ghg_gases_table(
                        template, parsed_answer_data, input_schema
                    )
                elif input_type == 'ghg_scope12_approach_input':
                    logger.info(f"'{primary_source_id}'는 ghg_scope12_approach_input 타입이므로 generate_ghg_scope12_approach_table을 호출합니다.")
                    table_content = await self.table_generator.generate_ghg_scope12_approach_table(
                        template, parsed_answer_data, input_schema
                    )
                elif input_type == 'ghg_scope3_approach_input':
                    logger.info(f"'{primary_source_id}'는 ghg_scope3_approach_input 타입이므로 generate_ghg_scope3_approach_table을 호출합니다.")
                    table_content = await self.table_generator.generate_ghg_scope3_approach_table(
                        template, parsed_answer_data, input_schema
                    )
                elif input_type == 'table_input':
                    logger.info(f"'{primary_source_id}'는 table_input 타입이므로 generate_simple_table을 호출합니다.")
                    table_content = await self.table_generator.generate_simple_table(
                        template, parsed_answer_data, input_schema
                    )
                else:
                    logger.warning(f"'{primary_source_id}'에 대한 테이블 생성기가 없습니다. data_required_type: '{input_type}'")
                    return empty_table

            if not table_content:
                 return empty_table

            return {"type": "table", "content": table_content}
        
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
            "source_requirement_ids_jsonb": template.source_requirement_ids_jsonb,
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