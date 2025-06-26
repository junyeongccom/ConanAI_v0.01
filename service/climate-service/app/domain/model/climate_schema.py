"""
기후 데이터 전처리 API 스키마 정의
Pydantic 모델로 요청/응답 구조 정의
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class FileProcessingStatus(str, Enum):
    """파일 처리 상태"""
    SUCCESS = "success"
    ERROR = "error"
    PROCESSING = "processing"


class PreprocessRequest(BaseModel):
    """전처리 요청 모델"""
    file_name: str = Field(
        description="전처리할 CSV 파일명 (형식: '고온 극한기후지수 - 지역명 (연별).csv')",
        example="고온 극한기후지수 - 서울특별시 (연별).csv"
    )


class PreprocessResponse(BaseModel):
    """전처리 응답 모델"""
    status: FileProcessingStatus = Field(
        description="처리 상태 (success/error/processing)"
    )
    message: str = Field(
        description="처리 결과 메시지"
    )
    summary: Optional[Dict[str, Any]] = Field(
        default=None,
        description="전처리 결과 요약 통계"
    )
    data: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        description="전처리된 데이터 샘플 (최대 10-20행)"
    )


# === 폭염일수 데이터 조회 API 스키마 ===

class HeatwaveDataItem(BaseModel):
    """폭염일수 데이터 항목"""
    scenario: str = Field(description="기후변화 시나리오")
    region: str = Field(description="지역명")
    year: str = Field(description="연도구간")
    heatwave_days: float = Field(description="폭염일수")
    change_days: Optional[float] = Field(default=None, description="변화량(일수)")
    change_rate: Optional[float] = Field(default=None, description="변화율(%)")


class HeatwaveDataResponse(BaseModel):
    """폭염일수 데이터 조회 응답"""
    status: str = Field(default="success", description="응답 상태")
    message: str = Field(description="응답 메시지")
    data: List[HeatwaveDataItem] = Field(description="폭염일수 데이터 목록")
    total_count: int = Field(description="총 데이터 개수")


 