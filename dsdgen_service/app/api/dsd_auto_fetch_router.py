"""
DSD 소스 데이터 자동 조회 및 생성 API 라우터
"""
from fastapi import APIRouter, Depends, Query
from app.domain.controller.dsd_auto_fetch_controller import DsdAutoFetchController
from app.domain.model.dsdgen_schema import DsdSourceListResponse

# 라우터 설정
router = APIRouter(prefix="/dsdgen", tags=["DSD Auto Generator"])

@router.get("/dsd-auto-fetch", response_model=DsdSourceListResponse)
async def get_or_create_dsd_source(
    corp_code: str = Query(..., description="기업 코드(필수)"),
    controller: DsdAutoFetchController = Depends()
) -> DsdSourceListResponse:
    """
    특정 기업 코드에 해당하는 DSD 소스 데이터를 조회하거나, 없으면 생성합니다.
    
    1. dsd_source 테이블에서 해당 기업코드의 데이터가 이미 존재하는지 확인
    2. 데이터가 있으면 → 그대로 반환
    3. 데이터가 없으면 →
       a. OpenDART에서 기업 XBRL zip 파일 다운로드
       b. zip 파일을 파싱하여 데이터프레임으로 변환하고 DB에 저장
    4. DB에 저장이 끝나면 → 다시 dsd_source 테이블에서 해당 기업 데이터를 조회하고 반환
    
    Args:
        corp_code: 기업 코드(필수)
    
    Returns:
        DsdSourceListResponse: 해당 기업의 DSD 소스 데이터 응답
    """
    return await controller.get_or_create_dsd_source(corp_code) 