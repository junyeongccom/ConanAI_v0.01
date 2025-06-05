"""
기후 데이터 전처리 컨트롤러
"""

import logging
from domain.service.climate_service import ClimateService
from domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse
)

logger = logging.getLogger(__name__)


class ClimateController:
    """기후 데이터 전처리 컨트롤러"""
    
    def __init__(self):
        self.climate_service = ClimateService()
    
    async def preprocess_single_file(self, request: PreprocessRequest) -> PreprocessResponse:
        """단일 파일 전처리 요청을 서비스로 전달"""
        logger.info(f"컨트롤러: 전처리 요청 시작 - {request.file_name}")
        result = await self.climate_service.preprocess_single_file(request)
        logger.info("컨트롤러: 전처리 요청 완료")
        return result
    
    async def preprocess_all_files(self) -> PreprocessResponse:
        """전체 파일 일괄 전처리 요청을 서비스로 전달"""
        logger.info("컨트롤러: 일괄 전처리 요청 시작")
        result = await self.climate_service.preprocess_all_files()
        logger.info("컨트롤러: 일괄 전처리 요청 완료")
        return result 