import logging
from typing import Optional, List
from fastapi import UploadFile

from app.platform.dart_client import DartClient
from app.foundation.preprocess_financial_data import preprocess_financial_statements, validate_financial_data
from app.foundation.preprocess_excel_data import parse_financial_excel
from app.domain.model.dsdcheck_schema import (
    FinancialDataRequest, 
    FinancialDataResponse,
    FinancialExcelResponse,
    FinancialStatement,
    ComparisonResult
)
from app.foundation.compare_logic import compare_statements

logger = logging.getLogger(__name__)


class DsdCheckService:
    """DSD 체크 서비스"""
    
    def __init__(self):
        self.dart_client = DartClient()
    
    async def get_financial_data(self, request: FinancialDataRequest) -> Optional[FinancialDataResponse]:
        """
        기업의 연결 및 별도 재무제표 데이터를 조회하고 전처리
        
        Args:
            request: 재무제표 조회 요청
            
        Returns:
            전처리된 재무제표 응답 또는 None
        """
        try:
            # 1. 기업코드 조회
            corp_code = self.dart_client.get_corp_code_local(request.corp_name)
            if not corp_code:
                logger.error(f"기업명 '{request.corp_name}'에 해당하는 기업코드를 찾을 수 없습니다.")
                return None
            
            logger.info(f"기업코드 조회 성공: {request.corp_name} -> {corp_code}")
            
            # 2. 연결 및 별도 재무제표 조회
            raw_financial_data = self.dart_client.get_all_financial_statements(corp_code, request.year)
            
            if not raw_financial_data or (not raw_financial_data.get("CFS") and not raw_financial_data.get("OFS")):
                logger.error(f"재무제표 데이터를 찾을 수 없습니다: {request.corp_name}, {request.year}")
                return None
            
            # 3. 데이터 전처리
            processed_statements = preprocess_financial_statements(raw_financial_data)
            
            if not processed_statements:
                logger.error("재무제표 전처리 결과가 비어있습니다.")
                return None
            
            # 4. 데이터 유효성 검증
            if not validate_financial_data(processed_statements):
                logger.warning("재무제표 데이터 유효성 검증에서 경고가 발생했습니다.")
            
            # 5. 최종 응답 생성
            response = FinancialDataResponse(
                corp_name=request.corp_name,
                corp_code=corp_code,
                year=request.year,
                statements=processed_statements
            )
            
            logger.info(f"재무제표 조회 완료: {request.corp_name}, {len(processed_statements)}개 보고서")
            return response
            
        except Exception as e:
            logger.error(f"재무제표 조회 서비스 오류: {e}")
            return None

    async def parse_uploaded_excel(self, file: UploadFile) -> Optional[FinancialExcelResponse]:
        """
        업로드된 엑셀 파일에서 재무제표 데이터를 파싱하고 전처리
        
        Args:
            file: 업로드된 엑셀 파일
            
        Returns:
            파싱된 재무제표 응답 또는 None
        """
        try:
            logger.info(f"엑셀 파일 파싱 시작: 파일명: {file.filename}")
            
            # 1. 엑셀 파일 파싱
            statements, corp_name, year = parse_financial_excel(file)
            
            if not statements:
                logger.error("엑셀 파일에서 재무제표 데이터를 추출할 수 없습니다.")
                return None
            
            # 2. 최종 응답 생성
            response = FinancialExcelResponse(
                corp_name=corp_name or "업로드된 엑셀 기반 추정값",
                year=year or 2023,
                statements=statements
            )
            
            logger.info(f"엑셀 파싱 완료: {corp_name}, {len(statements)}개 재무제표")
            return response
            
        except Exception as e:
            logger.error(f"엑셀 파싱 서비스 오류: {e}")
            return None

def compare_excel_and_dart_statements(
    excel_statements: List[FinancialStatement], 
    dart_statements: List[FinancialStatement]
) -> List[ComparisonResult]:
    return compare_statements(excel_statements, dart_statements)
