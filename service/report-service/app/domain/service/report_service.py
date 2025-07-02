import logging
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.foundation.disclosure_service_client import DisclosureServiceClient
from app.domain.repository.report_repository import ReportRepository
from app.domain.model.report_entity import ReportTemplate

logger = logging.getLogger(__name__)

class ReportService:
    """보고서 생성을 담당하는 서비스 클래스"""
    
    def __init__(self, db: Session, disclosure_client: DisclosureServiceClient, report_repository: ReportRepository):
        """
        ReportService 생성자
        
        Args:
            db (Session): 데이터베이스 세션
            disclosure_client (DisclosureServiceClient): 공시 서비스 클라이언트
            report_repository (ReportRepository): 보고서 템플릿 리포지토리
        """
        self.db = db
        self.disclosure_client = disclosure_client
        self.report_repository = report_repository

    async def generate_report(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        보고서 생성 메소드 - 템플릿과 사용자 답변을 수집하여 보고서 생성 준비
        
        Args:
            user_id (str): 사용자 ID
            
        Returns:
            Optional[Dict[str, Any]]: 생성된 보고서 데이터 또는 None (실패 시)
        """
        logger.info(f"보고서 생성 시작: user_id={user_id}")
        
        try:
            # 데이터 수집 1: 보고서 템플릿 목록 조회
            logger.info("보고서 템플릿 데이터 조회 시작")
            report_templates = self.report_repository.find_all_ordered_by_content_order()
            
            if not report_templates:
                logger.error("보고서 템플릿이 존재하지 않습니다.")
                return None
            
            logger.info(f"보고서 템플릿 조회 성공: {len(report_templates)}개")
            
            # 데이터 수집 2: 사용자 답변 데이터 조회
            logger.info(f"사용자 답변 데이터 조회 시작: user_id={user_id}")
            user_answers = await self.disclosure_client.get_my_answers(user_id)
            
            if user_answers is None:
                logger.error(f"disclosure-service로부터 답변을 가져오는 데 실패했습니다: user_id={user_id}")
                return None
            
            logger.info(f"사용자 답변 조회 성공: {len(user_answers)}개")
            
            # 성공 확인 로그
            logger.info(
                f"보고서 템플릿 {len(report_templates)}건, "
                f"사용자 답변 {len(user_answers)}건 로딩 완료. "
                f"보고서 생성을 시작합니다."
            )
            
            # TODO: 다음 단계 - 실제 보고서 생성 로직 구현
            # 현재는 수집된 데이터를 반환하여 생성 준비 완료를 표시
            return {
                "status": "success",
                "message": "보고서 생성 준비 완료",
                "data": {
                    "user_id": user_id,
                    "template_count": len(report_templates),
                    "answer_count": len(user_answers),
                    "templates": [self._template_to_dict(template) for template in report_templates],
                    "answers": user_answers
                }
            }
            
        except Exception as e:
            logger.error(f"보고서 생성 중 예외 발생: {e}")
            return None
    
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
    
    def get_templates_by_section(self, section_kr: str) -> List[ReportTemplate]:
        """
        특정 섹션의 보고서 템플릿 조회
        
        Args:
            section_kr (str): 섹션명 (한국어)
            
        Returns:
            List[ReportTemplate]: 해당 섹션의 템플릿 목록
        """
        try:
            return self.report_repository.find_by_section_kr(section_kr)
        except Exception as e:
            logger.error(f"섹션별 템플릿 조회 실패 (섹션: {section_kr}): {e}")
            return []
    
    def get_template_by_id(self, report_content_id: str) -> Optional[ReportTemplate]:
        """
        특정 ID의 보고서 템플릿 조회
        
        Args:
            report_content_id (str): 보고서 콘텐츠 ID
            
        Returns:
            Optional[ReportTemplate]: 조회된 템플릿 또는 None
        """
        try:
            return self.report_repository.find_by_report_content_id(report_content_id)
        except Exception as e:
            logger.error(f"템플릿 조회 실패 (ID: {report_content_id}): {e}")
            return None 