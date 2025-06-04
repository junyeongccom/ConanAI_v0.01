"""
DSD 소스 데이터 자동 조회 및 생성 서비스
"""
from typing import Optional
import asyncpg
import logging

from app.domain.repository.dsdgen_r_repository import DsdgenReadRepository
from app.domain.model.dsdgen_schema import DsdSourceSchema, DsdSourceListResponse
from app.domain.service.opendart_service import OpenDartService
from app.domain.service.xbrl_parser_service import XBRLParserService
from app.platform.notification import send_slack_notification

# 로거 설정
logger = logging.getLogger(__name__)

class DsdAutoFetchService:
    """
    DSD 소스 데이터 자동 조회 및 생성 서비스
    
    비즈니스 로직을 처리하고 레포지토리 레이어와 통신합니다.
    """
    
    def __init__(self, pool: Optional[asyncpg.Pool] = None):
        """
        서비스 초기화
        
        Args:
            pool: asyncpg 커넥션 풀 (읽기 작업용)
        """
        self.pool = pool
        self.dsdgen_repo = DsdgenReadRepository(pool) if pool else None
        self.opendart_service = OpenDartService()
        self.xbrl_parser_service = XBRLParserService()
    
    async def get_or_create_dsd_source(self, corp_code: str) -> DsdSourceListResponse:
        """
        특정 기업 코드에 해당하는 DSD 소스 데이터를 조회하거나, 없으면 생성합니다.
        
        1. dsd_source 테이블에서 해당 기업코드의 데이터가 이미 존재하는지 확인
        2. 데이터가 있으면 → 그대로 반환
        3. 데이터가 없으면 →
           a. OpenDART에서 기업 XBRL zip 파일 다운로드
           b. zip 파일을 파싱하여 데이터프레임으로 변환하고 DB에 저장
           c. DB에 저장이 끝나면 → 다시 dsd_source 테이블에서 해당 기업 데이터를 조회하고 반환
           d. DSD 생성 완료 시 Slack 알림 전송
        
        Args:
            corp_code: 기업 코드
            
        Returns:
            DsdSourceListResponse: DSD 소스 데이터 목록
            
        Raises:
            RuntimeError: 커넥션 풀이 초기화되지 않았거나 데이터 조회/생성 중 오류가 발생한 경우
        """
        if not self.pool:
            logger.error("읽기 작업을 위한 커넥션 풀이 초기화되지 않았습니다.")
            raise RuntimeError("읽기 작업을 위한 커넥션 풀이 초기화되지 않았습니다.")
            
        try:
            # 1. dsd_source 테이블에서 해당 기업코드 데이터 조회
            logger.info("기업코드 %s에 대한 DSD 소스 데이터 조회 시도", corp_code)
            sources = await self.dsdgen_repo.get_dsd_sources(corp_code)
            
            # 2. 데이터가 있으면 그대로 반환
            if sources and len(sources) > 0:
                logger.info("기업코드 %s의 DSD 소스 데이터 조회 성공: %d 건", corp_code, len(sources))
                source_models = [DsdSourceSchema(**source) for source in sources]
                return DsdSourceListResponse(success=True, data=source_models)
            
            # 3. 데이터가 없으면 생성 프로세스 시작
            logger.info("기업코드 %s의 DSD 소스 데이터가 없어 생성 프로세스 시작", corp_code)
            
            # a. OpenDART에서 기업 XBRL zip 파일 다운로드 (동기 함수이므로 await 사용 안 함)
            logger.info("OpenDART에서 기업코드 %s의 XBRL 파일 다운로드 시도", corp_code)
            zip_path = self.opendart_service.fetch_by_corp_code(corp_code)
            
            if not zip_path:
                error_msg = f"OpenDART에서 기업코드 {corp_code}의 XBRL 파일 다운로드 실패"
                logger.error(error_msg)
                
                # 실패 알림 전송
                await self._send_failure_notification(corp_code, error_msg)
                raise RuntimeError(error_msg)
            
            logger.info("OpenDART에서 기업코드 %s의 XBRL 파일 다운로드 성공: %s", corp_code, zip_path)
            
            # b. XBRL 파일을 파싱하여 데이터프레임으로 변환하고 DB에 저장
            logger.info("기업코드 %s의 XBRL 파일 파싱 및 DB 저장 시도", corp_code)
            df = await self.xbrl_parser_service.get_xbrl_to_dataframe(corp_code)
            
            if df.empty:
                error_msg = f"기업코드 {corp_code}의 XBRL 파일 파싱 결과가 비어있습니다."
                logger.error(error_msg)
                
                # 실패 알림 전송
                await self._send_failure_notification(corp_code, error_msg)
                raise RuntimeError(error_msg)
            
            logger.info("기업코드 %s의 XBRL 파일 파싱 및 DB 저장 성공: %d 건", corp_code, len(df))
            
            # c. DB에 저장이 끝났으므로 다시 dsd_source 테이블에서 해당 기업 데이터를 조회하고 반환
            logger.info("기업코드 %s의 DSD 소스 데이터 재조회 시도", corp_code)
            updated_sources = await self.dsdgen_repo.get_dsd_sources(corp_code)
            
            if not updated_sources or len(updated_sources) == 0:
                error_msg = f"기업코드 {corp_code}의 DSD 소스 데이터가 DB에 저장되지 않았습니다."
                logger.error(error_msg)
                
                # 실패 알림 전송
                await self._send_failure_notification(corp_code, error_msg)
                raise RuntimeError(error_msg)
            
            logger.info("기업코드 %s의 DSD 소스 데이터 재조회 성공: %d 건", corp_code, len(updated_sources))
            source_models = [DsdSourceSchema(**source) for source in updated_sources]
            
            # d. DSD 생성 완료 시 Slack 알림 전송
            await self._send_success_notification(corp_code, len(updated_sources))
            
            return DsdSourceListResponse(success=True, data=source_models)
            
        except Exception as e:
            error_msg = f"DSD 소스 데이터 조회 또는 생성 중 오류 발생: {str(e)}"
            logger.error(error_msg)
            
            # 예외 발생 시 실패 알림 전송
            await self._send_failure_notification(corp_code, error_msg)
            raise RuntimeError(error_msg) from e

    async def _send_success_notification(self, corp_code: str, data_count: int) -> None:
        """
        DSD 생성 성공 알림을 전송합니다.
        
        Args:
            corp_code: 기업 코드
            data_count: 생성된 데이터 건수
        """
        try:
            await send_slack_notification(
                message=f"기업코드 {corp_code}의 DSD 데이터 생성이 완료되었습니다. (총 {data_count}건)",
                title="DSD 생성 완료",
                status="SUCCESS",
                service="dsdgen",
                corp_code=corp_code,
                data_count=data_count,
                environment="production"
            )
        except Exception as e:
            logger.error("DSD 생성 성공 알림 전송 실패: %s", str(e))

    async def _send_failure_notification(self, corp_code: str, error_message: str) -> None:
        """
        DSD 생성 실패 알림을 전송합니다.
        
        Args:
            corp_code: 기업 코드
            error_message: 오류 메시지
        """
        try:
            await send_slack_notification(
                message=f"기업코드 {corp_code}의 DSD 데이터 생성 중 오류가 발생했습니다.\n오류: {error_message}",
                title="DSD 생성 실패",
                status="ERROR",
                service="dsdgen",
                corp_code=corp_code,
                error=error_message,
                environment="production"
            )
        except Exception as e:
            logger.error("DSD 생성 실패 알림 전송 실패: %s", str(e)) 