import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.model.report_entity import ReportTemplate, Report
from app.domain.model.report_schema import SavedReportCreate, SavedReportUpdate
from uuid import UUID

logger = logging.getLogger(__name__)

class ReportRepository:
    """
    보고서 템플릿 데이터에 접근하는 리포지토리 (Stateless)
    DB 세션을 상태로 저장하지 않고, 각 메소드 호출 시 주입받습니다.
    """
    def __init__(self):
        logger.info("ReportRepository (stateless) 초기화됨")

    def find_all_ordered_by_content_order(self, db: Session) -> List[ReportTemplate]:
        """
        content_order를 기준으로 정렬된 모든 보고서 템플릿을 조회합니다.
        """
        try:
            return db.query(ReportTemplate).order_by(ReportTemplate.content_order).all()
        except Exception as e:
            logger.error(f"모든 보고서 템플릿 조회 실패: {e}", exc_info=True)
            raise

    def find_by_report_content_id(self, db: Session, report_content_id: str) -> Optional[ReportTemplate]:
        """
        주어진 ID에 해당하는 보고서 템플릿을 조회합니다.
        """
        try:
            return db.query(ReportTemplate).filter(ReportTemplate.report_content_id == report_content_id).first()
        except Exception as e:
            logger.error(f"ID({report_content_id})로 템플릿 조회 실패: {e}", exc_info=True)
            raise

    def find_by_section_kr(self, db: Session, section_kr: str) -> List[ReportTemplate]:
        """
        주어진 섹션(KR)에 해당하는 모든 보고서 템플릿을 조회합니다.
        """
        try:
            return db.query(ReportTemplate).filter(ReportTemplate.section_kr == section_kr).order_by(ReportTemplate.content_order).all()
        except Exception as e:
            logger.error(f"섹션({section_kr})으로 템플릿 조회 실패: {e}", exc_info=True)
            raise

    # SavedReport CRUD
    def create_report(self, db: Session, user_id: UUID, report_data: SavedReportCreate) -> Report:
        try:
            db_report = Report(
                user_id=user_id,
                title=report_data.title,
                status=report_data.status,
                report_data=report_data.report_data
            )
            db.add(db_report)
            db.commit()
            db.refresh(db_report)
            return db_report
        except Exception as e:
            db.rollback()
            logger.error(f"보고서 생성 실패: {e}", exc_info=True)
            raise

    def find_report_by_id(self, db: Session, report_id: UUID) -> Optional[Report]:
        try:
            return db.query(Report).filter(Report.id == report_id).first()
        except Exception as e:
            logger.error(f"ID({report_id})로 보고서 조회 실패: {e}", exc_info=True)
            raise
    
    def find_reports_by_user_id(self, db: Session, user_id: UUID) -> List[Report]:
        try:
            return db.query(Report).filter(Report.user_id == user_id).order_by(Report.updated_at.desc()).all()
        except Exception as e:
            logger.error(f"사용자 ID({user_id})로 보고서 목록 조회 실패: {e}", exc_info=True)
            raise

    def update_report(self, db: Session, report_id: UUID, report_update: SavedReportUpdate) -> Optional[Report]:
        try:
            db_report = self.find_report_by_id(db, report_id)
            if not db_report:
                return None
            
            update_data = report_update.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_report, key, value)

            db.commit()
            db.refresh(db_report)
            return db_report
        except Exception as e:
            db.rollback()
            logger.error(f"보고서(ID: {report_id}) 업데이트 실패: {e}", exc_info=True)
            raise

    def delete_report(self, db: Session, report_id: UUID) -> bool:
        try:
            db_report = self.find_report_by_id(db, report_id)
            if not db_report:
                return False
            
            db.delete(db_report)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"보고서(ID: {report_id}) 삭제 실패: {e}", exc_info=True)
            raise 