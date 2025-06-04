from typing import Optional
from fastapi import UploadFile

from app.domain.service.dsdcheck_service import DsdCheckService, compare_excel_and_dart_statements
from app.domain.model.dsdcheck_schema import (
    FinancialDataRequest, 
    FinancialDataResponse,
    FinancialExcelResponse,
    ComparisonResult
)
from app.foundation.preprocess_excel_data import parse_financial_excel
from app.platform.dart_client import DartClient
from app.foundation.preprocess_financial_data import preprocess_financial_statements


class DsdCheckController:
    """DSD 체크 컨트롤러"""
    
    def __init__(self):
        self.service = DsdCheckService()
        self.dart_client = DartClient()
    
    async def get_financial_data(self, corp_name: str, year: int) -> Optional[FinancialDataResponse]:
        """
        기업의 연결 및 별도 재무제표 조회
        
        Args:
            corp_name: 기업명
            year: 사업연도
            
        Returns:
            재무제표 응답 또는 None
        """
        request = FinancialDataRequest(corp_name=corp_name, year=year)
        return await self.service.get_financial_data(request)

    async def upload_excel_file(self, file: UploadFile) -> Optional[FinancialExcelResponse]:
        """
        업로드된 엑셀 파일에서 재무제표 데이터 추출
        
        Args:
            file: 업로드된 엑셀 파일
            
        Returns:
            파싱된 재무제표 응답 또는 None
        """
        return await self.service.parse_uploaded_excel(file)

    async def compare_excel_to_dart(self, file: UploadFile, corp_name: str, year: int) -> list[ComparisonResult]:
        # 1. 엑셀 파싱
        excel_statements, _, _ = parse_financial_excel(file)
        # 2. DART 데이터 조회
        corp_code = self.dart_client.get_corp_code_local(corp_name)
        raw_financial_data = self.dart_client.get_all_financial_statements(corp_code, year)
        dart_statements = preprocess_financial_statements(raw_financial_data)
        # 3. 비교
        return compare_excel_and_dart_statements(excel_statements, dart_statements)
