from fastapi import APIRouter, status, Depends, Body, HTTPException
import logging
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Dict, Any

from app.domain.controller.report_controller import ReportController
from app.foundation.dependencies import get_current_user_id, get_report_controller, get_slm_client, get_db
from app.platform.slm_client import SLMClient
from app.domain.model.report_schema import SavedReportCreate, SavedReportUpdate, SavedReportBrief, SavedReportDetail, SavedReportInDB

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


# --- Saved Reports CRUD Endpoints ---

@router.post(
    "/reports/saved",
    response_model=SavedReportInDB,
    status_code=status.HTTP_201_CREATED,
    summary="생성된 보고서 저장"
)
def save_generated_report(
    report_create: SavedReportCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    `POST /reports`를 통해 생성된 보고서 데이터를 DB에 저장합니다.
    """
    logger.info(f"Router: /reports/saved (POST) 호출됨, user_id={user_id}")
    saved_report = controller.save_generated_report(db=db, user_id=user_id, report_create=report_create)
    return saved_report

@router.get(
    "/reports/saved",
    response_model=List[SavedReportBrief],
    summary="사용자의 저장된 보고서 목록 조회"
)
def get_all_saved_reports(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    현재 로그인된 사용자가 저장한 모든 보고서의 목록을 반환합니다.
    """
    logger.info(f"Router: /reports/saved (GET) 호출됨, user_id={user_id}")
    return controller.get_all_saved_reports(db=db, user_id=user_id)

@router.get(
    "/reports/saved/{report_id}",
    response_model=SavedReportDetail,
    summary="특정 보고서 상세 조회"
)
def get_saved_report_by_id(
    report_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    주어진 ID에 해당하는 보고서의 상세 내용을 반환합니다.
    해당 사용자의 보고서가 아니면 404 에러를 반환합니다.
    """
    logger.info(f"Router: /reports/saved/{report_id} (GET) 호출됨, user_id={user_id}")
    report = controller.get_saved_report_by_id(db=db, report_id=report_id, user_id=user_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 보고서를 찾을 수 없거나 접근 권한이 없습니다.")
    return report

@router.put(
    "/reports/saved/{report_id}",
    response_model=SavedReportDetail,
    summary="보고서 전체 업데이트"
)
def update_report(
    report_id: UUID,
    report_update: SavedReportUpdate,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    보고서의 전체 내용(제목, 상태, 데이터)을 업데이트합니다.
    """
    logger.info(f"Router: /reports/saved/{report_id} (PUT) 호출됨, user_id={user_id}")
    updated_report = controller.update_report(db=db, report_id=report_id, report_update=report_update, user_id=user_id)
    if not updated_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="업데이트할 보고서를 찾을 수 없거나 권한이 없습니다.")
    return updated_report

@router.delete(
    "/reports/saved/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="보고서 삭제"
)
def delete_existing_report(
    report_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    controller: ReportController = Depends(get_report_controller)
):
    """
    지정된 ID의 보고서를 삭제합니다.
    """
    logger.info(f"Router: /reports/saved/{report_id} (DELETE) 호출됨, user_id={user_id}")
    success = controller.delete_existing_report(db=db, report_id=report_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 보고서를 찾을 수 없거나 권한이 없습니다.")
    return None


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