"""
폭염일수 데이터 서비스
비즈니스 로직 처리
"""

from app.domain.repository.heatwave_repository import HeatwaveRepository
from app.domain.model.climate_schema import HeatwaveDataResponse, HeatwaveDataItem
from app.foundation.database import get_db_session
import logging
from typing import List
from fastapi import HTTPException

logger = logging.getLogger(__name__)


class HeatwaveService:
    """폭염일수 데이터 서비스"""
    
    async def get_heatwave_data_by_region_and_scenario(
        self, 
        region_name: str, 
        scenario: str
    ) -> HeatwaveDataResponse:
        """
        특정 지역과 시나리오의 폭염일수 데이터 조회
        
        Args:
            region_name: 지역명
            scenario: 기후변화 시나리오
            
        Returns:
            HeatwaveDataResponse: 폭염일수 데이터 응답
        """
        try:
            logger.info(f"🔍 폭염일수 데이터 조회 시작: {region_name}, {scenario}")
            
            with get_db_session() as db:
                repository = HeatwaveRepository(db)
                raw_data = await repository.get_heatwave_data_by_region_and_scenario(
                    region_name, scenario
                )
            
            # 데이터가 없는 경우
            if not raw_data:
                logger.warning(f"⚠️ 데이터 없음: {region_name}, {scenario}")
                return HeatwaveDataResponse(
                    status="success",
                    message=f"{region_name}의 {scenario} 시나리오 데이터가 없습니다.",
                    data=[],
                    total_count=0
                )
            
            # Pydantic 모델로 변환
            data_items = []
            for item in raw_data:
                data_items.append(HeatwaveDataItem(
                    scenario=item["scenario"],
                    region=item["region"],
                    year=item["year"],
                    heatwave_days=item["heatwave_days"],
                    change_days=item["change_days"],
                    change_rate=item["change_rate"]
                ))
            
            logger.info(f"✅ 폭염일수 데이터 조회 완료: {len(data_items)}건")
            
            return HeatwaveDataResponse(
                status="success",
                message=f"{region_name}의 {scenario} 시나리오 폭염일수 데이터를 조회했습니다.",
                data=data_items,
                total_count=len(data_items)
            )
            
        except Exception as e:
            logger.error(f"❌ 폭염일수 데이터 조회 실패: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"폭염일수 데이터 조회 중 오류가 발생했습니다: {str(e)}"
            )
    
    async def get_risk_levels_by_scenario_and_year(
        self, 
        scenario: str, 
        year: str
    ) -> List[dict]:
        """
        특정 시나리오의 모든 지역 평균 변화량 데이터 조회 (지도 색칠용)
        
        Args:
            scenario: 기후변화 시나리오
            year: 사용하지 않음 (하위 호환성을 위해 유지)
            
        Returns:
            지역별 평균 변화량 데이터 리스트
        """
        try:
            logger.info(f"🎨 지도 평균 변화량 데이터 조회 시작: {scenario}")
            
            with get_db_session() as db:
                repository = HeatwaveRepository(db)
                risk_data = await repository.get_risk_levels_by_scenario_and_year(
                    scenario=scenario,
                    year=year
                )
            
            if not risk_data:
                logger.warning(f"⚠️ 평균 변화량 데이터 없음: {scenario}")
                return []
            
            logger.info(f"✅ 지도 평균 변화량 데이터 조회 성공: {len(risk_data)}개 지역")
            return risk_data
            
        except Exception as e:
            logger.error(f"❌ 지도 평균 변화량 데이터 조회 실패: {str(e)}")
            return [] 