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
logger = logging.getLogger("disclosure-service")


class UserContextMiddleware(BaseHTTPMiddleware):
    """
    X-User-Id 헤더를 검증하고 사용자 컨텍스트를 관리하는 미들웨어
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # 사용자 인증이 필요없는 경로들 (공개 API)
        self.exempt_paths = {
            "/docs", "/redoc", "/openapi.json", "/health",
            "/disclosure-data/concepts",
            "/disclosure-data/adoption-status", 
            "/disclosure-data/disclosures",
            "/disclosure-data/requirements",
            "/disclosure-data/terms"
        }
        
        # 사용자별 데이터 접근이 필요한 경로들
        self.user_required_paths = {
            "/user-data/",
            "/answers/",
            "/my-"
        }
    
    def _is_exempt_path(self, path: str) -> bool:
        """경로가 인증 면제 대상인지 확인"""
        return path in self.exempt_paths
    
    def _requires_user_context(self, path: str) -> bool:
        """경로가 사용자 컨텍스트를 필요로 하는지 확인"""
        return any(path.startswith(prefix) for prefix in self.user_required_paths)
    
    def _validate_user_id(self, user_id_str: str) -> Optional[uuid.UUID]:
        """사용자 ID 형식 검증"""
        try:
            return uuid.UUID(user_id_str)
        except (ValueError, TypeError):
            logger.warning(f"잘못된 User ID 형식: {user_id_str}")
            return None
    
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # 공개 API는 사용자 컨텍스트 없이 통과
        if self._is_exempt_path(path):
            logger.debug(f"공개 API 접근: {path}")
            return await call_next(request)
        
        # X-User-Id 헤더 추출
        user_id_header = request.headers.get("X-User-Id")
        
        # 사용자 컨텍스트가 필요한 경로인 경우 필수 검증
        if self._requires_user_context(path):
            if not user_id_header:
                logger.warning(f"사용자 인증 필요한 경로에 X-User-Id 헤더 없음: {path}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="사용자 인증이 필요합니다."
                )
            
            # UUID 형식 검증
            user_id = self._validate_user_id(user_id_header)
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="잘못된 사용자 ID 형식입니다."
                )
            
            # 요청 상태에 사용자 ID 저장
            request.state.user_id = user_id
            logger.info(f"사용자 컨텍스트 설정 완료: {user_id} -> {path}")
        
        else:
            # 선택적으로 사용자 컨텍스트 설정
            if user_id_header:
                user_id = self._validate_user_id(user_id_header)
                if user_id:
                    request.state.user_id = user_id
                    logger.debug(f"선택적 사용자 컨텍스트 설정: {user_id}")
        
        return await call_next(request)


def get_current_user_id(request: Request) -> Optional[uuid.UUID]:
    """
    현재 요청의 사용자 ID를 반환하는 헬퍼 함수
    
    Args:
        request: FastAPI Request 객체
        
    Returns:
        사용자 UUID 또는 None
    """
    return getattr(request.state, 'user_id', None)


def require_user_context(request: Request) -> uuid.UUID:
    """
    사용자 컨텍스트가 필수인 경우 사용하는 헬퍼 함수
    
    Args:
        request: FastAPI Request 객체
        
    Returns:
        사용자 UUID
        
    Raises:
        HTTPException: 사용자 컨텍스트가 없는 경우
    """
    user_id = get_current_user_id(request)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자 인증이 필요합니다."
        )
    return user_id


# 외부로 노출할 요소들
__all__ = [
    "UserContextMiddleware", 
    "get_current_user_id", 
    "require_user_context"
] 