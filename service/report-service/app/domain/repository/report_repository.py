from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.domain.model.report_entity import ReportTemplate

logger = logging.getLogger(__name__)

class ReportRepository:
    """보고서 템플릿 관련 데이터베이스 접근을 담당하는 리포지토리"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def find_all_ordered_by_content_order(self) -> List[ReportTemplate]:
        """
        content_order를 기준으로 정렬된 전체 보고서 템플릿 목록을 조회
        
        Returns:
            List[ReportTemplate]: content_order 순으로 정렬된 보고서 템플릿 목록
        """
        try:
            templates = (
                self.db.query(ReportTemplate)
                .order_by(ReportTemplate.content_order)
                .all()
            )
            logger.info(f"보고서 템플릿 조회 완료: {len(templates)}개")
            return templates
        except Exception as e:
            logger.error(f"보고서 템플릿 조회 중 오류 발생: {e}")
            raise
    
    def find_by_report_content_id(self, report_content_id: str) -> Optional[ReportTemplate]:
        """
        특정 report_content_id로 보고서 템플릿을 조회
        
        Args:
            report_content_id (str): 조회할 보고서 콘텐츠 ID
            
        Returns:
            Optional[ReportTemplate]: 조회된 보고서 템플릿 또는 None
        """
        try:
            template = (
                self.db.query(ReportTemplate)
                .filter(ReportTemplate.report_content_id == report_content_id)
                .first()
            )
            return template
        except Exception as e:
            logger.error(f"보고서 템플릿 조회 중 오류 발생 (ID: {report_content_id}): {e}")
            raise
    
    def find_by_section_kr(self, section_kr: str) -> List[ReportTemplate]:
        """
        특정 섹션의 보고서 템플릿들을 content_order 순으로 조회
        
        Args:
            section_kr (str): 조회할 섹션명 (한국어)
            
        Returns:
            List[ReportTemplate]: 해당 섹션의 보고서 템플릿 목록
        """
        try:
            templates = (
                self.db.query(ReportTemplate)
                .filter(ReportTemplate.section_kr == section_kr)
                .order_by(ReportTemplate.content_order)
                .all()
            )
            logger.debug(f"섹션별 보고서 템플릿 조회 완료 (섹션: {section_kr}): {len(templates)}개")
            return templates
        except Exception as e:
            logger.error(f"섹션별 보고서 템플릿 조회 중 오류 발생 (섹션: {section_kr}): {e}")
            raise 