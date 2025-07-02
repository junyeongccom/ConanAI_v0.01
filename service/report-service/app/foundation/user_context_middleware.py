"""
사용자 컨텍스트 미들웨어
내부 서비스에서 X-User-Id 헤더를 검증하고 사용자 컨텍스트를 관리
"""
import logging
import uuid
from typing import Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# 로거 설정
logger = logging.getLogger("report-service")


class UserContextMiddleware(BaseHTTPMiddleware):
    """
    X-User-Id 헤더를 검증하고 사용자 컨텍스트를 관리하는 미들웨어
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # 사용자 인증이 필요없는 경로들 (공개 API)
        # report-service에 맞게 수정
        self.exempt_paths = {
            "/docs", "/redoc", "/openapi.json", "/health",
            "/test-slm", # 테스트용 엔드포인트는 인증 면제
        }
        
        # 사용자별 데이터 접근이 필요한 경로들
        # report-service에 맞게 수정
        self.user_required_paths = {
            "/reports",
        }
    
    def _is_exempt_path(self, path: str) -> bool:
        """경로가 인증 면제 대상인지 확인"""
        # 정확한 경로 매칭 외에, /docs/ 등 하위 경로도 면제 처리
        if path in self.exempt_paths:
            return True
        # Swagger UI의 정적 파일들을 위해 /docs/ 경로도 면제
        if path.startswith("/docs"):
            return True
        return False
    
    def _requires_user_context(self, path: str) -> bool:
        """경로가 사용자 컨텍스트를 필요로 하는지 확인"""
        return any(path.startswith(prefix) for prefix in self.user_required_paths)
    
    def _validate_user_id(self, user_id_str: str) -> Optional[str]:
        """사용자 ID 형식 검증 (report-service는 UUID가 아닌 일반 문자열을 사용)"""
        if isinstance(user_id_str, str) and user_id_str:
            return user_id_str
        logger.warning(f"잘못된 User ID 형식: {user_id_str}")
        return None
    
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        if self._is_exempt_path(path):
            logger.debug(f"공개 API 접근: {path}")
            return await call_next(request)
        
        user_id_header = request.headers.get("X-User-Id")
        
        if self._requires_user_context(path):
            if not user_id_header:
                logger.warning(f"사용자 인증 필요한 경로에 X-User-Id 헤더 없음: {path}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="사용자 인증이 필요합니다 (X-User-Id 헤더 누락)."
                )
            
            user_id = self._validate_user_id(user_id_header)
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="잘못된 사용자 ID 형식입니다."
                )
            
            request.state.user_id = user_id
            logger.info(f"사용자 컨텍스트 설정 완료: {user_id} -> {path}")
        
        else:
            if user_id_header:
                user_id = self._validate_user_id(user_id_header)
                if user_id:
                    request.state.user_id = user_id
                    logger.debug(f"선택적 사용자 컨텍스트 설정: {user_id}")
        
        return await call_next(request) 