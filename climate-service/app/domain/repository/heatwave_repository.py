"""
폭염일수 데이터 레포지토리
DB에서 폭염일수 관련 데이터를 조회하는 로직
"""

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)


class HeatwaveRepository:
    """폭염일수 데이터 레포지토리"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def get_heatwave_data_by_region_and_scenario(
        self, 
        region_name: str, 
        scenario: str
    ) -> List[dict]:
        """
        특정 지역과 시나리오의 폭염일수 데이터 조회
        
        Args:
            region_name: 지역명 (예: "서울특별시")
            scenario: 기후변화 시나리오 (예: "SSP2-4.5")
            
        Returns:
            폭염일수 데이터 리스트
        """
        try:
            query = text("""
                SELECT 
                    scenario,
                    region_name,
                    year_period,
                    heatwave_days,
                    change_amount,
                    change_rate
                FROM heatwave_summary 
                WHERE region_name = :region_name 
                AND scenario = :scenario
                ORDER BY year_period
            """)
            
            result = self.db.execute(
                query, 
                {"region_name": region_name, "scenario": scenario}
            ).fetchall()
            
            # 결과를 딕셔너리 리스트로 변환
            data = []
            for row in result:
                data.append({
                    "scenario": row[0],
                    "region": row[1],
                    "year": row[2],
                    "heatwave_days": float(row[3]) if row[3] is not None else 0.0,
                    "change_days": float(row[4]) if row[4] is not None else None,
                    "change_rate": float(row[5]) if row[5] is not None else None
                })
            
            logger.info(f"✅ 폭염일수 데이터 조회 성공: {region_name}, {scenario} - {len(data)}건")
            return data
            
        except Exception as e:
            logger.error(f"❌ 폭염일수 데이터 조회 실패: {region_name}, {scenario} - {str(e)}")
            raise
    
    async def get_risk_levels_by_scenario_and_year(
        self, 
        scenario: str, 
        year: str
    ) -> List[dict]:
        """
        특정 시나리오의 모든 지역 평균 변화량 데이터 조회 (지도 색칠용)
        
        Args:
            scenario: 기후변화 시나리오 (예: "SSP2-4.5")
            year: 사용하지 않음 (하위 호환성을 위해 유지)
            
        Returns:
            지역별 평균 변화량 데이터 리스트
        """
        try:
            query = text("""
                SELECT 
                    region_name,
                    AVG(heatwave_days) as avg_heatwave_days,
                    AVG(change_amount) as avg_change_amount
                FROM heatwave_summary 
                WHERE scenario = :scenario 
                AND year_period IN ('2030', '2040', '2050')
                GROUP BY region_name
                ORDER BY region_name
            """)
            
            result = self.db.execute(
                query, 
                {"scenario": scenario}
            ).fetchall()
            
            # 결과를 딕셔너리 리스트로 변환
            data = []
            for row in result:
                data.append({
                    "region": row[0],
                    "avg_heatwave_days": float(row[1]) if row[1] is not None else 0.0,
                    "avg_change_amount": float(row[2]) if row[2] is not None else 0.0
                })
            
            logger.info(f"✅ 평균 변화량 데이터 조회 성공: {scenario} - {len(data)}건")
            return data
            
        except Exception as e:
            logger.error(f"❌ 평균 변화량 데이터 조회 실패: {scenario} - {str(e)}")
            raise 