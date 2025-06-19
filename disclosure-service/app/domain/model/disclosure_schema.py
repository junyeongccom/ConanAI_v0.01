# IFRS S2 지표 및 지속가능성 공시 스키마 
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class DisclosureResponse(BaseModel):
    """ISSB S2 공시 정보 응답 스키마"""
    disclosure_id: int
    section: str
    category: str
    topic: Optional[str] = None
    paragraph: Optional[str] = None
    disclosure_ko: str
    disclosure_en: Optional[str] = None

    class Config:
        from_attributes = True


class DisclosureItem(BaseModel):
    """계층적 구조를 위한 공시 정보 아이템 스키마"""
    disclosure_id: int
    topic: Optional[str] = None
    disclosure_ko: str

    class Config:
        from_attributes = True


# 계층적 구조 응답 타입 정의
# Dict[section, Dict[category, List[DisclosureItem]]]
StructuredDisclosureResponse = Dict[str, Dict[str, List[DisclosureItem]]]


class RequirementResponse(BaseModel):
    """ISSB S2 요구사항 응답 스키마"""
    requirement_id: int
    disclosure_id: int
    requirement_order: int
    requirement_text_ko: str
    data_required_type: str
    input_placeholder_ko: Optional[str] = None
    input_guidance_ko: Optional[str] = None

    class Config:
        from_attributes = True


class TermResponse(BaseModel):
    """ISSB S2 용어 정의 응답 스키마"""
    term_id: int
    term_ko: str
    term_en: Optional[str] = None
    definition_ko: str
    definition_en: Optional[str] = None

    class Config:
        from_attributes = True


class ConceptResponse(BaseModel):
    """기후공시 개념 응답 스키마"""
    concept_id: int
    concept_name: str
    description: str
    category: Optional[str] = None

    class Config:
        from_attributes = True


class AdoptionStatusResponse(BaseModel):
    """ISSB 도입 현황 응답 스키마"""
    adoption_id: int
    country: str
    regulatory_authority: Optional[str] = None
    applicable_entity: Optional[str] = None
    adoption_timeline: Optional[str] = None
    remark: Optional[str] = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """사용자 응답 스키마"""
    user_id: UUID
    email: str
    username: Optional[str] = None
    company_name: Optional[str] = None
    industry_type: Optional[str] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AnswerResponse(BaseModel):
    """사용자 답변 응답 스키마"""
    answer_id: UUID
    user_id: UUID
    requirement_id: int
    answer_value_text: Optional[str] = None
    answer_value_number: Optional[Decimal] = None
    answer_value_boolean: Optional[bool] = None
    answer_value_location: Optional[str] = None
    answer_value_financial_impact: Optional[Decimal] = None
    answered_at: datetime
    last_edited_at: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


# 요청 스키마들 (필요한 경우)
class AnswerCreateRequest(BaseModel):
    """답변 생성 요청 스키마"""
    requirement_id: int
    answer_value_text: Optional[str] = None
    answer_value_number: Optional[Decimal] = None
    answer_value_boolean: Optional[bool] = None
    answer_value_location: Optional[str] = None
    answer_value_financial_impact: Optional[Decimal] = None


class AnswerUpdateRequest(BaseModel):
    """답변 수정 요청 스키마"""
    answer_value_text: Optional[str] = None
    answer_value_number: Optional[Decimal] = None
    answer_value_boolean: Optional[bool] = None
    answer_value_location: Optional[str] = None
    answer_value_financial_impact: Optional[Decimal] = None
    status: Optional[str] = None 