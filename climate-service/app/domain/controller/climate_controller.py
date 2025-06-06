"""
기후 데이터 전처리 컨트롤러
"""

from app.domain.service.climate_service import ClimateService
from app.domain.service.heatwave_service import HeatwaveService
from app.domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse,
    HeatwaveDataResponse
)


class ClimateController:
    """기후 데이터 전처리 컨트롤러"""
    
    def __init__(self):
        self.climate_service = ClimateService()
        self.heatwave_service = HeatwaveService()
    
    async def preprocess_single_file(self, request: PreprocessRequest) -> PreprocessResponse:
        """단일 파일 전처리 요청을 서비스로 전달"""
        print(f"🎯 컨트롤러: 전처리 요청 시작 - {request.file_name}")
        result = await self.climate_service.preprocess_single_file(request)
        print("✅ 컨트롤러: 전처리 요청 완료")
        return result
    
    async def preprocess_all_files(self) -> PreprocessResponse:
        """전체 파일 일괄 전처리 요청을 서비스로 전달"""
        print("🎯 컨트롤러: 일괄 전처리 요청 시작")
        result = await self.climate_service.preprocess_all_files()
        print("✅ 컨트롤러: 일괄 전처리 요청 완료")
        return result
    
    # === 폭염일수 데이터 조회 메서드 ===
    
    async def get_heatwave_data(self, region_name: str, scenario: str) -> HeatwaveDataResponse:
        """
        특정 지역과 시나리오의 폭염일수 데이터 조회
        
        Args:
            region_name: 지역명
            scenario: 기후변화 시나리오
            
        Returns:
            HeatwaveDataResponse: 폭염일수 데이터 응답
        """
        print(f"🎯 컨트롤러: 폭염일수 데이터 조회 시작 - {region_name}, {scenario}")
        result = await self.heatwave_service.get_heatwave_data_by_region_and_scenario(
            region_name, scenario
        )
        print("✅ 컨트롤러: 폭염일수 데이터 조회 완료")
        return result
    
    async def get_risk_levels_for_map(self, scenario: str, year: str) -> dict:
        """
        지도 색칠을 위한 모든 지역의 위험도 데이터 조회
        
        Args:
            scenario: 기후변화 시나리오
            year: 연도
            
        Returns:
            dict: 지역별 위험도 데이터
        """
        print(f"🎯 컨트롤러: 지도 위험도 데이터 조회 시작 - {scenario}, {year}")
        result = await self.heatwave_service.get_risk_levels_by_scenario_and_year(
            scenario, year
        )
        print("✅ 컨트롤러: 지도 위험도 데이터 조회 완료")
        return {
            "status": "success",
            "data": result,
            "total_count": len(result)
        } 