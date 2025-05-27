from pydantic import BaseModel
from typing import List, Optional

class GameCompanyInfo(BaseModel):
    """게임 기업 주가 정보 모델"""
    rank: int
    country: str
    company: str
    marketCap: str
    price: str
    change: str
    announcement: Optional[str] = None

class GameCompanyResponse(BaseModel):
    """게임 기업 주가 정보 응답 모델"""
    companies: List[GameCompanyInfo]
    total_count: int
    timestamp: str
