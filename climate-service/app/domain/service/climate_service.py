"""
기후 데이터 전처리 서비스
"""

import os
import logging
from fastapi import HTTPException

from foundation.preprocess_heatwave_data import (
    process_heatwave_csv, 
    process_multiple_heatwave_files,
    get_heatwave_summary
)
from domain.repository.climate_repository import ClimateRepository
from domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse,
    FileProcessingStatus
)

logger = logging.getLogger(__name__)


class ClimateService:
    """기후 데이터 전처리 서비스"""
    
    def __init__(self):
        self.climate_repository = ClimateRepository()
    
    async def preprocess_single_file(self, request: PreprocessRequest) -> PreprocessResponse:
        """단일 파일 전처리 및 DB 저장"""
        try:
            logger.info(f"서비스: 파일 경로 확인 시작 - {request.file_name}")
            file_path = f"app/platform/data/{request.file_name}"
            
            if not os.path.exists(file_path):
                raise HTTPException(
                    status_code=404, 
                    detail=f"파일을 찾을 수 없습니다: {request.file_name}"
                )
            
            logger.info("서비스: 전처리 함수 호출 시작")
            # 전처리 실행
            result_df = process_heatwave_csv(file_path)
            summary = get_heatwave_summary(result_df)
            
            logger.info("서비스: DB 저장 시작")
            # DB에 저장
            await self.climate_repository.save_heatwave_data(result_df)
            
            logger.info("서비스: 처리 완료")
            return PreprocessResponse(
                status=FileProcessingStatus.SUCCESS,
                message=f"전처리 및 DB 저장 완료: {len(result_df)}행 처리됨",
                summary=summary,
                data=result_df.to_dict(orient="records")[:10]  # 처음 10행만 반환
            )
            
        except Exception as e:
            logger.error(f"서비스: 오류 발생 - {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"전처리 실패: {str(e)}"
            )
    
    async def preprocess_all_files(self) -> PreprocessResponse:
        """전체 파일 일괄 전처리 및 DB 저장"""
        try:
            logger.info("서비스: 디렉토리 확인 시작")
            data_dir = "app/platform/data"
            
            if not os.path.exists(data_dir):
                raise HTTPException(
                    status_code=404,
                    detail=f"데이터 디렉토리를 찾을 수 없습니다: {data_dir}"
                )
            
            logger.info("서비스: 일괄 전처리 시작")
            # 일괄 전처리 실행
            combined_df = process_multiple_heatwave_files(data_dir)
            summary = get_heatwave_summary(combined_df)
            
            logger.info("서비스: 일괄 DB 저장 시작")
            # DB에 저장
            await self.climate_repository.save_heatwave_data(combined_df)
            
            logger.info("서비스: 일괄 처리 완료")
            return PreprocessResponse(
                status=FileProcessingStatus.SUCCESS,
                message=f"일괄 전처리 및 DB 저장 완료: {len(combined_df)}행 처리됨",
                summary=summary,
                data=combined_df.to_dict(orient="records")[:20]  # 처음 20행만 반환
            )
            
        except Exception as e:
            logger.error(f"서비스: 일괄 처리 오류 - {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"일괄 전처리 실패: {str(e)}"
            ) 