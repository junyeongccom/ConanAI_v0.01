"""
XBRL 재무제표 데이터를 위한 Pydantic 스키마 모델
"""
from typing import List
from pydantic import BaseModel, Field

class DsdSourceSchema(BaseModel):
    """
    DSD 소스 데이터를 위한 스키마
    """
    id: int = Field(..., description="고유 아이디")
    corp_code: str = Field(..., description="기업코드")
    source_name: str = Field(..., description="소스명")
    value: int = Field(..., description="값")
    year: int = Field(..., description="연도")
    unit: str = Field(..., description="단위")
    
    class Config:
        """Pydantic 모델 설정"""
        from_attributes = True

class DsdSourceListResponse(BaseModel):
    """
    DSD 소스 데이터 목록 응답을 위한 스키마
    """
    success: bool = Field(..., description="성공 여부")
    data: List[DsdSourceSchema] = Field(default_factory=list, description="DSD 소스 데이터 목록")
