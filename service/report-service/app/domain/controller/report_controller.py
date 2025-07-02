import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.domain.service.report_service import ReportService

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