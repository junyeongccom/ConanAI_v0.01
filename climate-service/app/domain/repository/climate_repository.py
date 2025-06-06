"""
기후 데이터 레퍼지토리
"""

import pandas as pd
import asyncpg
import os
from typing import List, Dict, Any


class ClimateRepository:
    """기후 데이터 DB 레퍼지토리"""
    
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST', 'hc_postgres_new'),
            'port': int(os.getenv('DB_PORT', 5432)),
            'user': os.getenv('DB_USER', 'hc_user'),
            'password': os.getenv('DB_PASSWORD', 'hc_password'),
            'database': os.getenv('DB_NAME', 'hc_db')
        }
    
    async def get_connection(self):
        """DB 연결 생성"""
        print(f"🔌 레퍼지토리: DB 연결 시도 - {self.db_config['host']}:{self.db_config['port']}")
        return await asyncpg.connect(**self.db_config)
    
    async def save_heatwave_data(self, df: pd.DataFrame) -> None:
        """전처리된 폭염일수 데이터를 DB에 저장"""
        try:
            print("🔌 레퍼지토리: DB 연결 시작")
            conn = await self.get_connection()
            
            print("🗑️ 레퍼지토리: 기존 데이터 삭제 시작")
            # 기존 데이터 삭제 (같은 지역의 데이터가 있다면)
            regions = df['지역명'].unique().tolist()
            for region in regions:
                await conn.execute(
                    "DELETE FROM heatwave_summary WHERE region_name = $1",
                    region
                )
            
            print(f"💾 레퍼지토리: 새 데이터 삽입 시작 - {len(df)}행")
            # 새 데이터 삽입
            for _, row in df.iterrows():
                await conn.execute("""
                    INSERT INTO heatwave_summary 
                    (scenario, region_name, year_period, heatwave_days, change_amount, change_rate, baseline_value, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                """, 
                    row['시나리오'],
                    row['지역명'], 
                    row['연도구간'],
                    float(row['폭염일수']),
                    float(row['변화량(일수)']),
                    float(row['변화율(%)']) if pd.notna(row['변화율(%)']) else None,
                    float(row['폭염일수']) if row['연도구간'] == '현재기후' else None
                )
            
            await conn.close()
            print(f"✅ 레퍼지토리: DB 저장 완료 - {len(df)}행")
            
        except Exception as e:
            print(f"❌ 레퍼지토리: DB 저장 실패 - {str(e)}")
            raise
    
    async def get_heatwave_data(self, region: str = None, scenario: str = None) -> List[Dict[str, Any]]:
        """저장된 폭염일수 데이터 조회"""
        try:
            conn = await self.get_connection()
            
            query = "SELECT * FROM heatwave_summary WHERE 1=1"
            params = []
            
            if region:
                query += " AND region_name = $" + str(len(params) + 1)
                params.append(region)
            
            if scenario:
                query += " AND scenario = $" + str(len(params) + 1)
                params.append(scenario)
            
            query += " ORDER BY scenario, region_name, year_period"
            
            rows = await conn.fetch(query, *params)
            await conn.close()
            
            return [dict(row) for row in rows]
            
        except Exception as e:
            print(f"❌ 레퍼지토리: DB 조회 실패 - {str(e)}")
            raise 