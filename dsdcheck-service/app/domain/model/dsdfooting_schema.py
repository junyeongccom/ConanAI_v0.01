from pydantic import BaseModel
from typing import List, Optional

class FootingResultItem(BaseModel):
    """개별 검증 항목 결과"""
    item: str
    expected: Optional[float] = None
    actual: Optional[float] = None
    is_match: bool
    children: Optional[List['FootingResultItem']] = None

class FootingSheetResult(BaseModel):
    """시트별 검증 결과"""
    sheet: str
    title: str
    results: List[FootingResultItem]

class FootingResponse(BaseModel):
    """전체 검증 결과 응답"""
    results: List[FootingSheetResult]
    total_sheets: int
    mismatch_count: int
