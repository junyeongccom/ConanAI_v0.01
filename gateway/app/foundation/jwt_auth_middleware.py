"""
JWT 인증 미들웨어
Gateway에서 모든 요청에 대해 JWT 토큰을 검증하는 미들웨어
Redis 블랙리스트 확인 기능 포함
"""
import os
import logging
from typing import Union
from pydantic import BaseModel
from jose import jwt, JWTError
from starlette.requests import Request
from starlette.responses import JSONResponse as StarletteJSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.datastructures import MutableHeaders
from dotenv import load_dotenv
from app.foundation.redis_client import get_redis_client

# 환경 변수 로드
load_dotenv()

# 로거 설정
logger = logging.getLogger("gateway-api")

# JWT 관련 환경 변수
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# JWT 검증을 위한 Pydantic 모델 정의
class JWTAuthToken(BaseModel):
    user_id: str  # user_id가 UUID라면 str
    exp: int  # expiration time
    # 여기에 필요한 다른 JWT 클레임 추가

# JWT 인증 미들웨어 클래스
class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # 인증이 필요 없는 경로들
        self.exempt_paths = {
            "/docs", "/redoc", "/openapi.json", 
            "/auth/google/login", "/auth/google/callback",
            "/", "/api/health", "/api/health/",
            # disclosure-data 관련 공개 API들
            "/api/disclosure/disclosure-data/concepts",
            "/api/disclosure/disclosure-data/adoption-status",
            "/api/disclosure/disclosure-data/disclosures",
            "/api/disclosure/disclosure-data/requirements", 
            "/api/disclosure/disclosure-data/terms",
            "/api/disclosure/health", "/api/disclosure/health/"
        }
        
        # 경로 패턴 매칭을 위한 접두사들 (선택사항)
        self.exempt_prefixes = [
            "/api/disclosure/disclosure-data/"
        ]
    
    def _is_exempt_path(self, path: str) -> bool:
        """경로가 인증 면제 대상인지 확인"""
        # 정확한 경로 매칭
        if path in self.exempt_paths:
            return True
        
        # 접두사 매칭
        for prefix in self.exempt_prefixes:
            if path.startswith(prefix):
                return True
                
        return False
    
    async def dispatch(self, request: Request, call_next):
        # CORS Preflight OPTIONS 요청은 인증 검사를 건너뛰고 즉시 통과
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # 디버깅을 위한 출력 (print로 변경)
        print(f"🔍 Request path: {request.url.path}")
        print(f"📋 Exempt paths: {self.exempt_paths}")
        print(f"📂 Exempt prefixes: {self.exempt_prefixes}")
        
        # 디버깅: 특정 경로 확인
        if request.url.path == "/api/health/":
            print(f"🔍 Special check for /api/health/: {'/api/health/' in self.exempt_paths}")
        
        # 미인증 경로 제외
        if self._is_exempt_path(request.url.path):
            print(f"✅ Exempt path: {request.url.path}")
            return await call_next(request)
        else:
            print(f"🔒 Authentication required for: {request.url.path}")
        
        # 토큰 추출 로직 (Authorization 헤더 우선, 쿠키 보조)
        token: str | None = None
        
        # 1. 먼저 Authorization 헤더 확인
        authorization: str | None = request.headers.get("Authorization")
        if authorization:
            try:
                scheme, token_from_header = authorization.split()
                if scheme.lower() == "bearer":
                    token = token_from_header
                    print(f"✅ Token extracted from Authorization header")
            except ValueError:
                # 헤더 형식이 잘못된 경우, 무시하고 쿠키 확인으로 넘어감
                print(f"⚠️ Invalid Authorization header format, checking cookie...")
                pass
        
        # 2. 헤더에 유효한 토큰이 없으면, 쿠키 확인
        if not token:
            token = request.cookies.get("access_token")
            if token:
                print(f"✅ Token extracted from access_token cookie")
        
        # 3. 최종적으로 토큰이 없는 경우에만 401 에러 반환
        if not token:
            print("❌ Authorization 헤더와 access_token 쿠키 모두에서 토큰을 찾을 수 없습니다.")
            return StarletteJSONResponse(
                status_code=401,
                content={"detail": "인증 정보가 없습니다."}
            )
        
        try:
            # JWT 검증
            decoded_token = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM]
            )
            
            # 블랙리스트 확인
            jti = decoded_token.get("jti")
            if jti:
                redis_client = get_redis_client()
                if await redis_client.exists(f"blacklist:{jti}"):
                    logger.warning(f"블랙리스트 토큰 사용 시도: jti={jti}")
                    return StarletteJSONResponse(
                        status_code=401,
                        content={"detail": "무효화된 토큰입니다. 다시 로그인해주세요."}
                    )
            
            # 사용자 ID 추출
            user_id = decoded_token.get("user_id")
            
            # request.scope['headers']는 (b'key', b'value') 튜플의 리스트임
            # 기존 헤더 리스트에 새로운 헤더 튜플을 추가
            request.scope['headers'].append(
                (b'x-user-id', str(user_id).encode('utf-8'))
            )
            
        except JWTError as e:
            logger.warning(f"JWT validation failed: {str(e)}")
            return StarletteJSONResponse(
                status_code=403,
                content={"detail": "유효하지 않거나 만료된 토큰입니다."}
            )
        
        # 다음 미들웨어/라우터로 요청 전달
        return await call_next(request)

# 외부로 노출할 요소들
__all__ = ["AuthMiddleware", "JWTAuthToken"] 