# 인증 관련 서비스 - 비즈니스 로직 계층
import httpx
import logging
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import os
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

from app.domain.repository.auth_repository import UserRepository
from app.domain.model.auth_schema import UserCreate, Token, UserResponse, GoogleUserInfo
from app.foundation.jwt_utils import create_access_token, verify_jwt_with_blacklist
from app.foundation.redis_client import get_redis_client

load_dotenv()

class AuthService:
    """인증 관련 비즈니스 로직을 담당하는 서비스"""
    
    def __init__(self, user_repository: UserRepository = None, redis_client=None):
        self.user_repository = user_repository or UserRepository()
        self.redis_client = redis_client or get_redis_client()
        self.logger = logging.getLogger(__name__)
    
    def generate_google_oauth_url(self) -> str:
        """Google OAuth 인증 URL 생성"""
        GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
        GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")
        
        if not GOOGLE_CLIENT_ID:
            raise ValueError("Google Client ID가 설정되지 않았습니다.")
        
        google_auth_url = (
            f"https://accounts.google.com/o/oauth2/auth"
            f"?client_id={GOOGLE_CLIENT_ID}"
            f"&redirect_uri={GOOGLE_REDIRECT_URI}"
            f"&scope=openid email profile"
            f"&response_type=code"
            f"&access_type=offline"
            f"&prompt=consent"
        )
        
        return google_auth_url
    
    async def handle_google_oauth_callback(self, db: Session, code: str) -> Optional[Token]:
        """
        Google OAuth authorization code를 처리하여 JWT 발급
        
        Args:
            db: 데이터베이스 세션
            code: Google OAuth authorization code
        
        Returns:
            Token 객체 또는 None
        """
        try:
            # 1. Google 토큰 교환
            tokens = await self._exchange_code_for_tokens(code)
            if not tokens:
                return None
            
            # 2. ID 토큰 검증 및 사용자 정보 추출
            user_info = await self._verify_and_extract_user_info(tokens.get("id_token"))
            if not user_info:
                return None
            
            # 3. 사용자 로그인/회원가입 처리
            user = await self.process_user_login_or_signup(db, user_info)
            if not user:
                return None
            
            # 4. JWT 토큰 생성
            token = self.create_jwt_token(user)
            
            self.logger.info(f"Google OAuth 콜백 처리 완료 - User: {user.email}")
            return token
            
        except Exception as e:
            self.logger.error(f"Google OAuth 콜백 처리 중 예외 발생: {str(e)}", exc_info=True)
            return None
    
    async def _exchange_code_for_tokens(self, code: str) -> Optional[Dict[str, Any]]:
        """Authorization code를 Google 토큰으로 교환"""
        GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
        GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
        GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")
        
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            self.logger.error("Google OAuth 설정이 누락되었습니다.")
            return None
        
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
                self.logger.error(f"Google 토큰 교환 실패: {response.status_code} - {response.text}")
                return None
            
            tokens = response.json()
            if not tokens.get("id_token"):
                self.logger.error("Google 응답에서 id_token을 찾을 수 없습니다.")
                return None
            
            return tokens
    
    async def _verify_and_extract_user_info(self, id_token_str: str) -> Optional[GoogleUserInfo]:
        """Google ID 토큰 검증 및 사용자 정보 추출"""
        try:
            GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
            
            # Google의 공개 키를 사용하여 ID 토큰 검증
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                requests.Request(), 
                GOOGLE_CLIENT_ID
            )
            
            # 발급자(issuer) 검증
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                self.logger.error("잘못된 토큰 발급자입니다.")
                return None
            
            # 사용자 정보 추출
            google_user_id = idinfo.get('sub')
            email = idinfo.get('email')
            name = idinfo.get('name')
            picture = idinfo.get('picture')
            
            if not google_user_id or not email:
                self.logger.error("ID 토큰에서 필수 사용자 정보를 찾을 수 없습니다.")
                return None
            
            return GoogleUserInfo(
                google_id=google_user_id,
                email=email,
                name=name,
                picture=picture
            )
            
        except ValueError as e:
            self.logger.error(f"Google ID 토큰 검증 실패: {e}")
            return None
    
    async def process_user_login_or_signup(self, db: Session, user_info: GoogleUserInfo) -> Optional[UserResponse]:
        """사용자 로그인 또는 회원가입 처리"""
        try:
            # 기존 사용자 조회
            existing_user = self.user_repository.find_user_by_google_id(db, user_info.google_id)
            
            if not existing_user:
                # 새 사용자 생성 (자동 회원가입)
                self.logger.info(f"새 사용자 생성 중: {user_info.email}")
                user_create = UserCreate(
                    email=user_info.email,
                    username=user_info.name or user_info.email.split('@')[0],
                    google_id=user_info.google_id
                )
                existing_user = self.user_repository.create_user(db, user_create)
                self.logger.info(f"새 사용자 생성 완료 - User ID: {existing_user.user_id}")
            else:
                self.logger.info(f"기존 사용자 로그인 - User ID: {existing_user.user_id}")
            
            # 마지막 로그인 시간 업데이트
            updated_user = self.user_repository.update_user_last_login(db, existing_user.user_id)
            
            # 사용자 정보 응답 모델 생성
            return UserResponse(
                user_id=updated_user.user_id,
                email=updated_user.email,
                username=updated_user.username,
                company_name=updated_user.company_name,
                industry_type=updated_user.industry_type,
                created_at=updated_user.created_at,
                updated_at=updated_user.updated_at,
                last_login_at=updated_user.last_login_at
            )
            
        except Exception as e:
            self.logger.error(f"사용자 로그인/회원가입 처리 실패: {e}")
            return None
    
    def create_jwt_token(self, user: UserResponse) -> Token:
        """사용자 정보를 바탕으로 JWT 토큰 생성"""
        token_data = {
            "sub": str(user.user_id),
            "email": user.email,
            "username": user.username,
            "name": user.username,  # 프론트엔드 호환성을 위해 추가
        }
        access_token = create_access_token(data=token_data)
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user
        )
    
    async def logout_and_blacklist_token(self, token: str) -> Dict[str, Any]:
        """토큰 검증 및 블랙리스트 추가"""
        try:
            # JWT 토큰 검증 및 페이로드 추출
            from app.foundation.jwt_utils import verify_jwt
            payload = verify_jwt(token)
            if not payload:
                raise ValueError("유효하지 않은 토큰입니다.")
            
            # jti와 exp 추출
            jti = payload.get("jti")
            exp = payload.get("exp")
            
            if not jti:
                raise ValueError("토큰에 jti(고유 식별자)가 없습니다.")
            
            if not exp:
                raise ValueError("토큰에 만료 시간이 없습니다.")
            
            # TTL 계산 (토큰 만료까지 남은 시간)
            current_timestamp = datetime.utcnow().timestamp()
            ttl = int(exp - current_timestamp)
            
            # 이미 만료된 토큰인 경우
            if ttl <= 0:
                return {
                    "message": "이미 만료된 토큰입니다.",
                    "success": True
                }
            
            # Redis에 토큰 블랙리스트 추가
            await self.redis_client.set(
                f"blacklist:{jti}",
                "blacklisted",
                ex=ttl
            )
            
            self.logger.info(f"토큰 블랙리스트 등록 완료: jti={jti}, ttl={ttl}초")
            
            return {
                "message": "로그아웃이 성공적으로 처리되었습니다.",
                "success": True
            }
            
        except Exception as e:
            self.logger.error(f"로그아웃 처리 중 오류: {e}")
            raise
    
    async def verify_token_with_blacklist_check(self, token: str) -> Optional[Dict[str, Any]]:
        """블랙리스트 확인이 포함된 토큰 검증"""
        return await verify_jwt_with_blacklist(token)
    
    def get_user_by_id(self, db: Session, user_id: str) -> Optional[UserResponse]:
        """사용자 ID로 사용자 정보 조회"""
        try:
            from uuid import UUID
            user = self.user_repository.find_user_by_id(db, UUID(user_id))
            
            if not user:
                return None
            
            return UserResponse(
                user_id=user.user_id,
                email=user.email,
                username=user.username,
                company_name=user.company_name,
                industry_type=user.industry_type,
                created_at=user.created_at,
                updated_at=user.updated_at,
                last_login_at=user.last_login_at
            )
            
        except Exception as e:
            self.logger.error(f"사용자 조회 실패: {e}")
            return None
    
    # 기존 호환성을 위한 메서드들
    async def get_google_user_info(self, id_token: str) -> Optional[GoogleUserInfo]:
        """Google ID Token을 검증하고 사용자 정보 추출 (기존 호환성)"""
        return await self._verify_and_extract_user_info(id_token)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰 검증 (동기 버전 - 기존 호환성 유지)"""
        from app.foundation.jwt_utils import verify_jwt
        return verify_jwt(token)
    
    async def verify_token_async(self, token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰 검증 (블랙리스트 확인 포함 - 비동기 버전)"""
        return await verify_jwt_with_blacklist(token) 