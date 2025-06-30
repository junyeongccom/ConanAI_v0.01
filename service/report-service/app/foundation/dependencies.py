from fastapi import Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

# DB 및 클라이언트 임포트
# from app.foundation.database import get_db
from app.foundation.disclosure_service_client import DisclosureServiceClient

# 계층별 클래스 임포트
# from app.domain.repository.report_repository import ReportRepository # (향후 사용 예정)
from app.domain.service.report_service import ReportService
from app.domain.controller.report_controller import ReportController

def get_current_user_id(request: Request) -> str:
    """UserContextMiddleware로부터 user_id를 가져오는 의존성"""
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(status_code=500, detail="사용자 컨텍스트가 없습니다.")
    return user_id

def get_disclosure_service_client() -> DisclosureServiceClient:
    return DisclosureServiceClient()

def get_report_service(
    # db: Session = Depends(get_db),
    disclosure_client: DisclosureServiceClient = Depends(get_disclosure_service_client)
) -> ReportService:
    # report_repository는 나중에 생성
    # return ReportService(db=db, disclosure_client=disclosure_client)
    return ReportService(disclosure_client=disclosure_client)

def get_report_controller(
    report_service: ReportService = Depends(get_report_service)
) -> ReportController:
    return ReportController(report_service=report_service) 