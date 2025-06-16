# 인증 관련 서비스 
import httpx
import logging
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

from app.domain.repository.auth_repository import UserRepository
from app.domain.model.user_schema import UserCreate, Token, UserResponse, GoogleUserInfo
from app.foundation.jwt_utils import create_access_token, verify_jwt

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
    
    async def handle_google_oauth_callback(self, db: Session, code: str) -> Optional[Token]:
        """
        Google OAuth authorization code를 처리하여 JWT 발급
        완전한 Authorization Code Flow 구현
        
        Args:
            db: 데이터베이스 세션
            code: Google OAuth authorization code
        
        Returns:
            Token 객체 또는 None
        """
        logger = logging.getLogger(__name__)
        
        try:
            # 1. 환경 변수 로드 및 검증
            GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
            GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
            GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")
            
            if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
                logger.error("Google OAuth 설정이 누락되었습니다. GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET를 확인하세요.")
                return None
            
            logger.info(f"Google OAuth 콜백 처리 시작 - Client ID: {GOOGLE_CLIENT_ID[:10]}...")
            
            # 2. Google 토큰 엔드포인트에 POST 요청하여 토큰 교환
            token_data = {
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code != 200:
                    logger.error(f"Google 토큰 교환 실패: {response.status_code} - {response.text}")
                    return None
                
                tokens = response.json()
                id_token_str = tokens.get("id_token")
                
                if not id_token_str:
                    logger.error("Google 응답에서 id_token을 찾을 수 없습니다.")
                    return None
            
            # 3. ID 토큰 검증 (google-auth 라이브러리 사용)
            try:
                # Google의 공개 키를 사용하여 ID 토큰 검증
                idinfo = id_token.verify_oauth2_token(
                    id_token_str, 
                    requests.Request(), 
                    GOOGLE_CLIENT_ID
                )
                
                # 발급자(issuer) 검증
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    logger.error("잘못된 토큰 발급자입니다.")
                    return None
                
                logger.info("Google ID 토큰 검증 성공")
                
            except ValueError as e:
                logger.error(f"Google ID 토큰 검증 실패: {e}")
                return None
            
            # 4. 사용자 정보 추출
            google_user_id = idinfo.get('sub')
            email = idinfo.get('email')
            name = idinfo.get('name')
            picture = idinfo.get('picture')
            
            if not google_user_id or not email:
                logger.error("ID 토큰에서 필수 사용자 정보를 찾을 수 없습니다.")
                return None
            
            logger.info(f"Google 사용자 정보 추출 성공 - Email: {email}, Name: {name}")
            
            # 5. 기존 사용자 조회 또는 새 사용자 생성
            existing_user = self.user_repository.get_user_by_google_id(db, google_user_id)
            
            if not existing_user:
                # 새 사용자 생성 (자동 회원가입)
                logger.info(f"새 사용자 생성 중: {email}")
                user_create = UserCreate(
                    email=email,
                    username=name or email.split('@')[0],  # name이 없으면 이메일 앞부분 사용
                    google_id=google_user_id
                )
                existing_user = self.user_repository.create_user(db, user_create)
                logger.info(f"새 사용자 생성 완료 - User ID: {existing_user.user_id}")
            else:
                logger.info(f"기존 사용자 로그인 - User ID: {existing_user.user_id}")
            
            # 6. 마지막 로그인 시간 업데이트
            updated_user = self.user_repository.update_user_last_login(db, existing_user.user_id)
            
            # 7. 우리 서비스의 JWT 생성
            token_data = {
                "sub": str(updated_user.user_id),
                "email": updated_user.email,
                "username": updated_user.username,
                "name": updated_user.username,  # 프론트엔드 호환성을 위해 추가
            }
            access_token = create_access_token(data=token_data)
            
            # 8. 사용자 정보 응답 모델 생성
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
            
            logger.info(f"JWT 토큰 생성 완료 - User: {updated_user.email}")
            
            return Token(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
            
        except Exception as e:
            logger.error(f"Google OAuth 콜백 처리 중 예외 발생: {str(e)}", exc_info=True)
            return None
    


    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰 검증"""
        return verify_jwt(token) 