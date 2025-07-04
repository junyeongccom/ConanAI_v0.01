import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.domain.service.report_service import ReportService
from app.domain.model.report_schema import SavedReportCreate, SavedReportUpdate, SavedReportBrief, SavedReportDetail
from app.domain.model.report_entity import Report
from uuid import UUID

logger = logging.getLogger(__name__)

class ReportController:
    def __init__(self, report_service: ReportService):
        self.report_service = report_service
        logger.info("ReportController 초기화 완료")

    async def create_report(self, user_id: str, db: Session) -> List[Dict[str, Any]]:
        """
        보고서 생성을 위한 서비스 호출을 담당합니다.
        DB 세션을 서비스 계층으로 전달합니다.
        """
        print(f"✅ 4. 컨트롤러 실행: create_report 호출됨, user_id={user_id}")
        logger.info(f"Controller: create_report 호출됨, user_id={user_id}")
        try:
            report_data = await self.report_service.generate_report(user_id=user_id, db=db)
            if report_data is None:
                logger.warning(f"Controller: 서비스가 보고서 데이터를 반환하지 않음, user_id={user_id}")
                return []
            logger.info(f"Controller: 보고서 생성 서비스 호출 성공, user_id={user_id}")
            return report_data
        except Exception as e:
            logger.error(f"Controller: 보고서 생성 중 예외 발생, user_id={user_id}: {e}", exc_info=True)
            # API 경계에서는 에러를 다시 발생시켜 FastAPI 예외 처리 미들웨어가 처리하도록 합니다.
            raise

    # --- Saved Report Controller Methods ---

    def save_generated_report(self, db: Session, user_id: UUID, report_create: SavedReportCreate) -> Report:
        logger.info(f"Controller: save_generated_report 호출됨, user_id={user_id}")
        return self.report_service.create_saved_report(db, user_id, report_create)

    def get_all_saved_reports(self, db: Session, user_id: UUID) -> List[SavedReportBrief]:
        logger.info(f"Controller: get_all_saved_reports 호출됨, user_id={user_id}")
        reports = self.report_service.get_saved_reports_for_user(db, user_id)
        # Entity 객체 리스트를 Pydantic 스키마 리스트로 변환
        return [SavedReportBrief.from_orm(report) for report in reports]

    def get_saved_report_by_id(self, db: Session, report_id: UUID, user_id: UUID) -> Optional[SavedReportDetail]:
        logger.info(f"Controller: get_saved_report_by_id 호출됨, report_id={report_id}")
        report = self.report_service.get_saved_report_detail(db, report_id, user_id)
        if report:
            # Entity 객체를 Pydantic 스키마로 변환
            return SavedReportDetail.from_orm(report)
        return None

    def update_report(self, db: Session, report_id: UUID, report_update: SavedReportUpdate, user_id: UUID) -> Optional[SavedReportDetail]:
        logger.info(f"Controller: update_report 호출됨, report_id={report_id}")
        updated_report = self.report_service.update_report(db, report_id, report_update, user_id)
        if updated_report:
            return SavedReportDetail.from_orm(updated_report)
        return None

    def delete_existing_report(self, db: Session, report_id: UUID, user_id: UUID) -> bool:
        logger.info(f"Controller: delete_existing_report 호출됨, report_id={report_id}")
        return self.report_service.delete_saved_report(db, report_id, user_id) 