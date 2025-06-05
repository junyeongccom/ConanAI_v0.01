"""
기후 데이터 전처리 API 라우터
"""

from fastapi import APIRouter
from domain.controller.climate_controller import ClimateController
from domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse
)

router = APIRouter(
    prefix="/api",
    tags=["기후 데이터 전처리"]
)

# 컨트롤러 인스턴스 생성
climate_controller = ClimateController()


@router.post("/preprocess", response_model=PreprocessResponse)
async def preprocess_single_file(request: PreprocessRequest):
    """
    단일 CSV 파일 전처리
    
    - 지정된 CSV 파일을 읽어와 폭염일수 데이터 전처리
    - 연도구간별 평균 및 변화량 계산
    """
    return await climate_controller.preprocess_single_file(request)


@router.post("/preprocess/bulk", response_model=PreprocessResponse)
async def preprocess_all_files():
    """
    전체 CSV 파일 일괄 전처리
    
    - data 디렉토리의 모든 '고온 극한기후지수' CSV 파일을 일괄 처리
    - 모든 지역 데이터를 통합하여 반환
    """
    return await climate_controller.preprocess_all_files()


 