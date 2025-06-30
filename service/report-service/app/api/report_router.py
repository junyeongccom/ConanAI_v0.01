from fastapi import APIRouter, status, Depends
import logging

from app.domain.controller.report_controller import ReportController
from app.foundation.dependencies import get_current_user_id, get_report_controller

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# APIRouter 인스턴스 생성
router = APIRouter(
    tags=["reports"]
)

@router.get("/health")
async def health_check():
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: 서비스 상태 메시지
    """
    return {"message": "Hello World from report-service"}

@router.post("/reports", status_code=status.HTTP_202_ACCEPTED)
async def create_report(
    user_id: str = Depends(get_current_user_id),
    controller: ReportController = Depends(get_report_controller)
):
    """
    보고서 생성을 시작하는 엔드포인트입니다.
    Disclosure Service로부터 데이터를 가져와 서비스 간 통신을 검증합니다.
    """
    logger.info("보고서 생성 요청 수신")
    result = await controller.create_report(user_id)
    if result is None:
        return {"message": "Failed to get data from disclosure service."}
    
    logger.info("보고서 생성 작업 시작")
    return {"message": "Report generation started.", "data": result} 