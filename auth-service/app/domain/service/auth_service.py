# 인증 관련 서비스 
import httpx
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

from app.domain.repository.auth_repository import UserRepository
from app.domain.model.user_schema import UserCreate, Token, UserResponse, GoogleUserInfo
from app.platform.jwt_utils import create_access_token, verify_jwt

load_dotenv()

class AuthService:
    def __init__(self):
        self.user_repository = UserRepository()
    
    async def get_google_user_info(self, id_token: str) -> Optional[GoogleUserInfo]:
        """Google ID Token을 검증하고 사용자 정보 추출"""
        try:
            # Google tokeninfo API를 사용하여 ID 토큰 검증
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
                )
                
                if response.status_code != 200:
                    return None
                
                user_data = response.json()
                
                # 필수 필드 검증
                if "sub" not in user_data or "email" not in user_data:
                    return None
                
                return GoogleUserInfo(
                    google_id=user_data["sub"],
                    email=user_data["email"],
                    name=user_data.get("name"),
                    picture=user_data.get("picture")
                )
        except Exception as e:
            print(f"Google 사용자 정보 가져오기 실패: {e}")
            return None
    
    async def handle_google_callback(self, db: Session, id_token: str) -> Optional[Token]:
        """Google OAuth 콜백 처리 및 JWT 발급"""
        try:
            # Google에서 사용자 정보 가져오기
            google_user = await self.get_google_user_info(id_token)
            if not google_user:
                return None
            
            # 기존 사용자 조회
            existing_user = self.user_repository.get_user_by_google_id(
                db, google_user.google_id
            )
            
            if not existing_user:
                # 새 사용자 생성 (자동 회원가입)
                user_create = UserCreate(
                    email=google_user.email,
                    username=google_user.name,
                    google_id=google_user.google_id
                )
                existing_user = self.user_repository.create_user(db, user_create)
            
            # 마지막 로그인 시간 업데이트
            updated_user = self.user_repository.update_user_last_login(
                db, existing_user.user_id
            )
            
            # JWT 생성
            token_data = {
                "sub": str(updated_user.user_id),
                "email": updated_user.email,
                "username": updated_user.username
            }
            access_token = create_access_token(data=token_data)
            
            # 사용자 정보 응답 모델 생성
            user_response = UserResponse(
                user_id=updated_user.user_id,
                email=updated_user.email,
                username=updated_user.username,
                company_name=updated_user.company_name,
                industry_type=updated_user.industry_type,
                created_at=updated_user.created_at,
                updated_at=updated_user.updated_at,
                last_login_at=updated_user.last_login_at
            )
            
            return Token(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
            
        except Exception as e:
            print(f"Google 콜백 처리 실패: {e}")
            return None
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰 검증"""
        return verify_jwt(token) 