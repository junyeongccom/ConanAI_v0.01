"""
XBRL 재무제표 데이터 처리 서비스
"""
from typing import Dict, Any, Optional
import asyncpg
import logging

from app.domain.repository.dsdgen_r_repository import DsdgenReadRepository
from app.domain.model.dsdgen_schema import DsdSourceSchema, DsdSourceListResponse

# 로거 설정
logger = logging.getLogger(__name__)

class DsdgenService:
    """
    XBRL 재무제표 데이터 처리 서비스
    
    비즈니스 로직을 처리하고 레포지토리 레이어와 통신합니다.
    """
    
    def __init__(self, pool: Optional[asyncpg.Pool] = None):
        """
        서비스 초기화
        
        Args:
            pool: asyncpg 커넥션 풀 (읽기 작업용)
        """
        self.pool = pool
    
    async def get_dsd_sources(self, corp_code: str) -> DsdSourceListResponse:
        """
        특정 기업 코드에 해당하는 DSD 소스 데이터를 조회합니다.
        
        Args:
            corp_code: 기업 코드
            
        Returns:
            DsdSourceListResponse: DSD 소스 데이터 목록
            
        Raises:
            RuntimeError: 커넥션 풀이 초기화되지 않았거나 데이터 조회 중 오류가 발생한 경우
        """
        if not self.pool:
            logger.error("읽기 작업을 위한 커넥션 풀이 초기화되지 않았습니다.")
            raise RuntimeError("읽기 작업을 위한 커넥션 풀이 초기화되지 않았습니다.")
            
        try:
            # 레포지토리 인스턴스 생성
            repo = DsdgenReadRepository(self.pool)
            
            # DSD 소스 데이터 조회
            sources = await repo.get_dsd_sources(corp_code)
            
            # 결과를 Pydantic 모델로 변환
            source_models = [DsdSourceSchema(**source) for source in sources]
            
            return DsdSourceListResponse(success=True, data=source_models)
        except Exception as e:
            logger.error("DSD 소스 조회 실패: %s", e)
            raise RuntimeError(f"DSD 소스 데이터 조회 중 오류가 발생했습니다: {str(e)}") from e
