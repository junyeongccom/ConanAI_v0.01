from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
from fastapi import UploadFile


class FinancialItem(BaseModel):
    """재무제표 개별 항목"""
    account_nm: str  # 계정명
    account_id: str  # 계정ID
    thstrm_amount: str  # 당기금액
    frmtrm_amount: str  # 전기금액


class FinancialStatement(BaseModel):
    """재무제표 구분별 데이터"""
    fs_div: str  # CFS(연결) 또는 OFS(별도)
    sj_div: str  # BS, IS, CIS, CF, SCE
    items: List[FinancialItem]


class FinancialDataResponse(BaseModel):
    """최종 재무제표 응답"""
    corp_name: str
    corp_code: str
    year: int
    statements: List[FinancialStatement]


class DartFinancialApiItem(BaseModel):
    """DART API 개별 응답 항목"""
    rcept_no: str
    reprt_code: str
    bsns_year: str
    corp_code: str
    sj_div: str
    sj_nm: str
    account_id: str
    account_nm: str
    account_detail: Optional[str] = None
    thstrm_nm: str
    thstrm_amount: str
    frmtrm_nm: str
    frmtrm_amount: str
    bfefrmtrm_nm: Optional[str] = None
    bfefrmtrm_amount: Optional[str] = None
    ord: str
    currency: str


class DartFinancialApiResponse(BaseModel):
    """DART API 전체 응답"""
    status: str
    message: str
    list: List[DartFinancialApiItem]


class FinancialDataRequest(BaseModel):
    """재무제표 조회 요청"""
    corp_name: str
    year: int


# 엑셀 업로드 관련 스키마 추가
class FinancialStatementItem(BaseModel):
    """엑셀에서 추출된 재무제표 개별 항목"""
    account_nm: str  # 계정명
    thstrm_amount: str  # 당기금액 (전기)
    frmtrm_amount: str  # 전기금액 (전전기)


class FinancialStatementFromExcel(BaseModel):
    """엑셀에서 추출된 재무제표 구분별 데이터"""
    fs_div: str  # CFS(연결) 또는 OFS(별도)
    sj_div: str  # BS, IS, CIS, CF, SCE
    items: List[FinancialStatementItem]


class FinancialExcelResponse(BaseModel):
    """엑셀 파싱 응답"""
    corp_name: str
    year: int
    statements: List[FinancialStatementFromExcel]


class SheetMapping(BaseModel):
    """시트 매핑 정보"""
    sheet_name: str
    title: str
    fs_div: str  # CFS 또는 OFS
    sj_div: str  # BS, IS, CIS, CF, SCE


class ComparisonResult(BaseModel):
    fs_div: str
    sj_div: str
    account_nm: str
    column: Literal["thstrm_amount", "frmtrm_amount"]
    excel: str
    dart: str
    diff: int
