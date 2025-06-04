"""
XBRL 재무제표 데이터 조회를 위한 asyncpg 기반 읽기 레포지토리
"""
from typing import List, Dict, Any
import asyncpg

class DsdgenReadRepository:
    """
    XBRL 재무제표 데이터를 조회하기 위한 asyncpg 기반 레포지토리
    고성능 조회를 위해 asyncpg의 raw SQL 쿼리를 사용합니다.
    """
    
    def __init__(self, pool: asyncpg.Pool):
        """
        레포지토리 생성자
        
        Args:
            pool: asyncpg 커넥션 풀
        """
        self.pool = pool
    
    async def get_dsd_sources(self, corp_code: str) -> List[Dict[str, Any]]:
        """
        특정 기업 코드에 해당하는 DSD 소스 데이터를 조회합니다.
        
        Args:
            corp_code: 기업 코드
            
        Returns:
            List[Dict[str, Any]]: DSD 소스 데이터 목록
        """
        query = """
        SELECT id, corp_code, source_name, value, year, unit
        FROM dsd_source
        WHERE corp_code = $1
        ORDER BY id
        """
        
        async with self.pool.acquire() as conn:
            results = await conn.fetch(query, corp_code)
            return [dict(row) for row in results]
