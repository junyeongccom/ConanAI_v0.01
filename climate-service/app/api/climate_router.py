"""
기후 데이터 전처리 API 라우터
"""

from fastapi import APIRouter
from app.domain.controller.climate_controller import ClimateController
from app.domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse,
    HeatwaveDataResponse
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
    print(f"📁 받은 파일명: {request.file_name}")
    return await climate_controller.preprocess_single_file(request)


@router.post("/preprocess/bulk", response_model=PreprocessResponse)
async def preprocess_all_files():
    """
    전체 CSV 파일 일괄 전처리
    
    - data 디렉토리의 모든 '고온 극한기후지수' CSV 파일을 일괄 처리
    - 모든 지역 데이터를 통합하여 반환
    """
    print("📂 받은 요청: 전체 파일 일괄 전처리")
    return await climate_controller.preprocess_all_files()


# === 폭염일수 데이터 조회 API ===

@router.get("/heatwave/region/{region_name}/scenario/{scenario}", response_model=HeatwaveDataResponse)
async def get_heatwave_data(region_name: str, scenario: str):
    """
    특정 지역과 시나리오의 폭염일수 데이터 조회
    
    - 지역명과 기후변화 시나리오를 기준으로 폭염일수 데이터 조회
    - 연도구간별 폭염일수, 변화량, 변화율 정보 제공
    
    Args:
        region_name: 지역명 (예: 서울특별시, 부산광역시 등)
        scenario: 기후변화 시나리오 (SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5)
    """
    print(f"🌡️ 폭염일수 데이터 조회 요청: {region_name}, {scenario}")
    return await climate_controller.get_heatwave_data(region_name, scenario)


@router.get("/heatwave/map/scenario/{scenario}/year/{year}")
async def get_risk_levels_for_map(scenario: str, year: str):
    """
    지도 색칠을 위한 모든 지역의 위험도 데이터 조회
    
    - 특정 시나리오와 연도의 모든 지역 위험도 데이터를 한 번에 조회
    - 지도에서 지역별 색상 표시를 위한 데이터 제공
    
    Args:
        scenario: 기후변화 시나리오 (SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5)
        year: 연도 (2030, 2040, 2050)
    """
    print(f"🗺️ 지도 위험도 데이터 조회 요청: {scenario}, {year}")
    return await climate_controller.get_risk_levels_for_map(scenario, year)


 