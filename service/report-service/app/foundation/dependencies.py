import logging
from typing import Annotated

from fastapi import Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.foundation.database import get_db
from app.foundation.disclosure_service_client import DisclosureServiceClient
from app.platform.slm_client import SLMClient
from app.domain.generators.text_generator import TextGenerator
from app.domain.repository.report_repository import ReportRepository
from app.domain.service.report_service import ReportService
from app.domain.controller.report_controller import ReportController

logger = logging.getLogger(__name__)

# --- 클라이언트 및 생성기 의존성 ---

def get_disclosure_service_client() -> DisclosureServiceClient:
    return DisclosureServiceClient()

def get_slm_client() -> SLMClient:
    try:
        return SLMClient()
    except ValueError as e:
        logger.critical(f"SLMClient 초기화 실패: {e}")
        raise

def get_text_generator(slm_client: Annotated[SLMClient, Depends(get_slm_client)]) -> TextGenerator:
    return TextGenerator(slm_client=slm_client)

# --- 리포지토리 의존성 (Stateless) ---

def get_report_repository() -> ReportRepository:
    """Stateless ReportRepository 인스턴스를 생성합니다."""
    return ReportRepository()

# --- 서비스 및 컨트롤러 의존성 ---

def get_report_service(
    report_repository: Annotated[ReportRepository, Depends(get_report_repository)],
    disclosure_client: Annotated[DisclosureServiceClient, Depends(get_disclosure_service_client)],
    text_generator: Annotated[TextGenerator, Depends(get_text_generator)]
) -> ReportService:
    """ReportService 의존성 주입 (DB 세션은 메소드 호출 시 전달)"""
    print("✅ 2. 의존성 생성: ReportService 인스턴스 생성 시도")
    return ReportService(
        report_repository=report_repository,
        disclosure_client=disclosure_client,
        text_generator=text_generator
    )

def get_report_controller(report_service: ReportService = Depends(get_report_service)) -> ReportController:
    print("✅ 3. 의존성 생성: ReportController 인스턴스 생성 시도")
    return ReportController(report_service=report_service)

# --- 유틸리티 의존성 ---
def get_current_user_id(request: Request) -> str:
    """UserContextMiddleware로부터 user_id를 가져오는 의존성"""
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(status_code=500, detail="사용자 컨텍스트가 없습니다.")
    return user_id 