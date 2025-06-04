"""
XBRL 재무제표 데이터 처리 API 라우터
"""
from fastapi import APIRouter, Depends, Query
from app.domain.controller.dsdgen_controller import DsdgenController
from app.domain.model.dsdgen_schema import DsdSourceListResponse
from app.platform.notification import send_slack_notification

# 라우터 설정
router = APIRouter(prefix="/dsdgen", tags=["DSD Generator"])

@router.get("/dsd-source", response_model=DsdSourceListResponse, response_model_exclude_none=True)
async def get_dsd_sources(
    corp_code: str = Query(..., description="기업 코드(필수)"),
    controller: DsdgenController = Depends()
) -> DsdSourceListResponse:
    """
    특정 기업 코드에 해당하는 DSD 소스 데이터를 조회합니다.
    
    Args:
        corp_code: 기업 코드(필수)
    
    Returns:
        DsdSourceListResponse: 해당 기업의 DSD 소스 데이터 응답
    """
    return await controller.get_dsd_sources(corp_code)

@router.post("/test-slack-notification")
async def test_slack_notification(
    message: str = Query("테스트 메시지입니다.", description="알림 메시지"),
    title: str = Query("테스트 알림", description="알림 제목"),
    status: str = Query("INFO", description="상태 (SUCCESS, ERROR, WARNING, INFO)")
):
    """
    Slack 알림 기능을 테스트합니다.
    
    Args:
        message: 알림 메시지
        title: 알림 제목  
        status: 상태
        
    Returns:
        dict: 알림 전송 결과
    """
    try:
        success = await send_slack_notification(
            message=message,
            title=title,
            status=status,
            service="dsdgen",
            environment="development"
        )
        
        return {
            "success": success,
            "message": "알림 전송 성공" if success else "알림 전송 실패"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"알림 전송 중 오류 발생: {str(e)}"
        }
