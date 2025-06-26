# 인증 관련 스키마 
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    google_id: str

class UserResponse(BaseModel):
    user_id: uuid.UUID
    email: EmailStr
    username: Optional[str] = None
    company_name: Optional[str] = None
    industry_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2+ 에서 ORM 객체 매핑을 위해 필요

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse  # 토큰과 함께 사용자 정보를 반환

class GoogleUserInfo(BaseModel):
    """Google OAuth에서 받아온 사용자 정보"""
    google_id: str
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None

class HealthResponse(BaseModel):
    """서비스 상태 확인 응답 모델"""
    message: str
    status: str

class AuthCallbackUser(BaseModel):
    """OAuth 콜백 응답에 포함될 사용자 정보"""
    user_id: str
    email: str
    username: Optional[str] = None
    company_name: Optional[str] = None
    industry_type: Optional[str] = None

class AuthCallbackResponse(BaseModel):
    """OAuth 콜백 성공 응답 모델"""
    success: bool
    message: str
    user: AuthCallbackUser 