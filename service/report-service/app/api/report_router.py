from fastapi import APIRouter, status, Depends, Body, HTTPException
import logging
from sqlalchemy.orm import Session

from app.domain.controller.report_controller import ReportController
from app.foundation.dependencies import get_current_user_id, get_report_controller, get_slm_client, get_db
from app.platform.slm_client import SLMClient

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

@router.post("/reports", status_code=status.HTTP_200_OK, summary="ESG 보고서 초안 생성")
async def create_report(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    사용자의 답변 데이터를 기반으로 AI를 사용하여 ESG 보고서 초안을 생성합니다.
    """
    print("✅ 1. 라우터 진입: /reports 요청 수신")
    logger.info(f"Router: /reports 엔드포인트 호출됨, user_id={user_id}")
    result = await controller.create_report(user_id=user_id, db=db)
    return {"message": "Report generation successful.", "data": result}

@router.post("/test-slm", tags=["_Test"], summary="SLM 클라이언트 테스트 엔드포인트")
async def test_slm_generation(
    prompt: str = Body(..., embed=True, description="SLM에게 보낼 테스트 프롬프트"),
    slm_client: SLMClient = Depends(get_slm_client)
):
    """
    SLM 텍스트 생성을 직접 테스트하기 위한 임시 엔드포인트입니다.
    
    Gemini API가 정상적으로 호출되는지, API 키가 유효한지 등을 검증할 수 있습니다.
    """
    if not prompt or not prompt.strip():
        raise HTTPException(
            status_code=400,
            detail="프롬프트 내용이 비어있습니다."
        )
        
    logger.info(f"SLM 테스트 생성 요청 수신: prompt='{prompt[:30]}...'")
    generated_text = await slm_client.generate_text(prompt)

    if generated_text is None:
        logger.error("SLM 테스트 생성 실패: SLMClient가 None을 반환했습니다.")
        raise HTTPException(
            status_code=502, # Bad Gateway: 외부 서비스(SLM)로부터 잘못된 응답을 받음
            detail="SLM 텍스트 생성에 실패했습니다. 서버 로그를 확인해주세요."
        )
    
    logger.info("SLM 테스트 생성 성공")
    return {"prompt": prompt, "generated_text": generated_text} 