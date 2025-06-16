"""
JWT 인증 미들웨어
Gateway에서 모든 요청에 대해 JWT 토큰을 검증하는 미들웨어
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
from dotenv import load_dotenv

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
            "/", "/api/health"
        }
    
    async def dispatch(self, request: Request, call_next):
        # 미인증 경로 제외
        if request.url.path in self.exempt_paths:
            return await call_next(request)
        
        # Authorization 헤더 추출
        authorization: str = request.headers.get("Authorization")
        
        if not authorization:
            return StarletteJSONResponse(
                status_code=401,
                content={"detail": "인증 정보가 없습니다."}
            )
        
        try:
            # Bearer 토큰 추출
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise ValueError("Invalid authentication scheme")
        except ValueError:
            return StarletteJSONResponse(
                status_code=401,
                content={"detail": "잘못된 인증 형식입니다."}
            )
        
        try:
            # JWT 검증
            decoded_token = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM]
            )
            
            # 사용자 ID 추출 및 요청 상태 저장
            request.state.user_id = decoded_token.get("user_id")
            
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