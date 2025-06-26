"""
의존성 주입 관리 모듈
- 모든 서비스의 의존성 관리를 중앙화
- 책임 분리 원칙에 따라 의존성 주입 로직을 별도 관리
"""
from fastapi import Depends
from sqlalchemy.orm import Session

from app.domain.repository.auth_repository import UserRepository
from app.domain.service.auth_service import AuthService
from app.domain.controller.auth_controller import AuthController
from app.foundation.database import get_db
from app.foundation.redis_client import get_redis_client


def get_user_repository() -> UserRepository:
    """UserRepository 인스턴스 생성"""
    return UserRepository()


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
    redis_client = Depends(get_redis_client)
) -> AuthService:
    """AuthService 인스턴스 생성 - Redis 클라이언트 의존성 포함"""
    return AuthService(
        user_repository=user_repository,
        redis_client=redis_client
    )


def get_auth_controller(
    auth_service: AuthService = Depends(get_auth_service)
) -> AuthController:
    """AuthController 인스턴스 생성"""
    return AuthController(auth_service=auth_service) 