# irsummary_schema.py 
from pydantic import BaseModel
from typing import Dict, Optional

class InvestmentOpinion(BaseModel):
    """투자 의견 모델"""
    opinion: str
    target_price: str
    target_per: str

class FinancialData(BaseModel):
    """재무 데이터 모델"""
    매출: Optional[float] = None
    영업이익: Optional[float] = None

class FinancialForecast(BaseModel):
    """재무 전망 모델"""
    Q2_24: Optional[FinancialData] = None
    F_2025: Optional[FinancialData] = None
    F_2026: Optional[FinancialData] = None

class IRSummaryResult(BaseModel):
    """IR 요약 결과 모델"""
    investment_opinion: Dict[str, str]
    forecast: Dict[str, Dict[str, float]]
    summary: str

class IRAnalysisRequest(BaseModel):
    """IR 분석 요청 모델"""
    file_name: str
    file_size: int

class IRAnalysisResponse(BaseModel):
    """IR 분석 응답 모델"""
    success: bool
    message: str
    data: Optional[IRSummaryResult] = None 