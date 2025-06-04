"""
DSD 소스 데이터 자동 조회 및 생성 컨트롤러
"""
from fastapi import Depends, HTTPException, status
import asyncpg
import logging

from app.domain.service.dsd_auto_fetch_service import DsdAutoFetchService
from app.domain.model.dsdgen_schema import DsdSourceListResponse
from app.foundation.db.asyncpg_pool import get_pool

# 로거 설정
logger = logging.getLogger(__name__)

class DsdAutoFetchController:
    """
    DSD 소스 데이터 자동 조회 및 생성 컨트롤러
    
    이 클래스는 HTTP 요청을 처리하고 서비스 레이어와 통신합니다.
    """
    
    def __init__(self, pool: asyncpg.Pool = Depends(get_pool)):
        """
        컨트롤러 초기화
        
        Args:
            pool: asyncpg 커넥션 풀
        """
        self.service = DsdAutoFetchService(pool=pool)
    
    async def get_or_create_dsd_source(self, corp_code: str) -> DsdSourceListResponse:
        """
        특정 기업 코드에 해당하는 DSD 소스 데이터를 조회하거나, 없으면 생성합니다.
        
        Args:
            corp_code: 기업 코드
            
        Returns:
            DsdSourceListResponse: DSD 소스 데이터 응답
            
        Raises:
            HTTPException: 데이터 조회 또는 생성 중 오류가 발생한 경우
        """
        try:
            return await self.service.get_or_create_dsd_source(corp_code)
        except Exception as e:
            logger.error("DSD 소스 데이터 처리 오류: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            ) 