"""
XBRL 재무제표 데이터 처리 API 라우터
"""
from fastapi import APIRouter, Depends, Query
from app.domain.controller.dsdgen_controller import DsdgenController
from app.domain.model.dsdgen_schema import DsdSourceListResponse

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
