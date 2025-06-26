# Answer 도메인 스키마
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class AnswerUpdatePayload(BaseModel):
    """단일 답변 업데이트 요청 스키마"""
    requirement_id: str = Field(..., description="요구사항 ID (예: met-1, met-2)")
    answer_data: Any = Field(..., description="답변 데이터 (타입은 requirement의 data_required_type에 따라 결정)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "requirement_id": "met-1",
                "answer_data": "Yes"
            }
        }

class AnswerBatchUpdatePayload(BaseModel):
    """배치 답변 업데이트 요청 스키마"""
    answers: List[AnswerUpdatePayload] = Field(..., description="답변 목록")
    
    class Config:
        json_schema_extra = {
            "example": {
                "answers": [
                    {
                        "requirement_id": "met-1", 
                        "answer_data": "Yes"
                    },
                    {
                        "requirement_id": "met-2",
                        "answer_data": ["Option1", "Option2"]
                    },
                    {
                        "requirement_id": "met-3",
                        "answer_data": {
                            "field1": "value1",
                            "field2": "value2"
                        }
                    }
                ]
            }
        }

class AnswerResponse(BaseModel):
    """답변 응답 스키마"""
    answer_id: UUID
    user_id: UUID
    requirement_id: str
    answer_value_text: Optional[str] = None
    answer_value_number: Optional[float] = None
    answer_value_boolean: Optional[bool] = None
    answer_value_date: Optional[datetime] = None
    answer_value_json: Optional[Any] = None
    answered_at: datetime
    last_edited_at: datetime
    
    class Config:
        from_attributes = True

class AnswerBatchResponse(BaseModel):
    """배치 답변 처리 응답 스키마"""
    success: bool
    message: str
    processed_count: int
    created_count: int
    updated_count: int
    failed_count: int
    failed_requirements: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "답변 배치 처리가 완료되었습니다.",
                "processed_count": 3,
                "created_count": 2,
                "updated_count": 1,
                "failed_count": 0,
                "failed_requirements": []
            }
        } 