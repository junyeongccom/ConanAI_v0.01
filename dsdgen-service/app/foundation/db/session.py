"""
SQLAlchemy 기반 비동기 데이터베이스 세션 관리 모듈

이 모듈은 PostgreSQL 데이터베이스에 대한 비동기 연결을 SQLAlchemy를 통해 제공합니다.
싱글턴 패턴을 사용하여 애플리케이션 전체에서 하나의 엔진과 세션 팩토리만 생성되도록 합니다.
"""

import os
from typing import AsyncGenerator, Optional
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)

# 환경 변수 로드
load_dotenv()

# 글로벌 변수로 엔진과 세션 팩토리 선언
_engine: Optional[AsyncEngine] = None
_session_factory: Optional[async_sessionmaker[AsyncSession]] = None


def _build_database_url() -> str:
    """
    환경 변수에서 DB 연결 정보를 가져와 SQLAlchemy 연결 URL을 생성합니다.
    
    Returns:
        str: SQLAlchemy 연결 URL
        
    Raises:
        ValueError: 필수 환경 변수가 설정되지 않은 경우
    """
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_name = os.getenv("DB_NAME")
    
    # 필수 환경 변수 검증
    missing_vars = []
    if not db_host: missing_vars.append("DB_HOST")
    if not db_port: missing_vars.append("DB_PORT")
    if not db_user: missing_vars.append("DB_USER")
    if not db_password: missing_vars.append("DB_PASSWORD")
    if not db_name: missing_vars.append("DB_NAME")
    
    if missing_vars:
        raise ValueError(f"필수 환경 변수가 설정되지 않았습니다: {', '.join(missing_vars)}")
    
    # SQLAlchemy 비동기 드라이버 URL 생성
    return f"postgresql+asyncpg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


async def get_engine() -> AsyncEngine:
    """
    SQLAlchemy 비동기 엔진의 싱글턴 인스턴스를 반환합니다.
    
    Returns:
        AsyncEngine: SQLAlchemy 비동기 엔진 인스턴스
        
    Raises:
        ValueError: 필수 환경 변수가 설정되지 않은 경우
    """
    global _engine
    
    if _engine is None:
        # 환경 변수로부터 DB URL 생성
        database_url = _build_database_url()
        
        # 데이터베이스 연결 엔진 생성
        _engine = create_async_engine(
            database_url,
            echo=False,  # SQL 쿼리 로깅 (개발 환경에서는 True로 설정 가능)
            pool_size=5,  # 기본 커넥션 풀 크기
            max_overflow=10,  # 최대 추가 커넥션 수
            pool_timeout=30,  # 커넥션 타임아웃 (초)
            pool_recycle=1800,  # 커넥션 재활용 시간 (초)
        )
        print("[INFO] SQLAlchemy 비동기 엔진이 초기화되었습니다.")
    
    return _engine


async def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """
    SQLAlchemy 비동기 세션 팩토리의 싱글턴 인스턴스를 반환합니다.
    
    Returns:
        async_sessionmaker[AsyncSession]: SQLAlchemy 비동기 세션 팩토리
    """
    global _session_factory
    
    if _session_factory is None:
        engine = await get_engine()
        
        # 세션 팩토리 생성
        _session_factory = async_sessionmaker(
            engine,
            expire_on_commit=False,  # commit 후에도 객체 사용 가능
            class_=AsyncSession,
        )
        print("[INFO] SQLAlchemy 비동기 세션 팩토리가 초기화되었습니다.")
    
    return _session_factory


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    요청 처리를 위한 비동기 데이터베이스 세션을 생성하고 제공합니다.
    
    Yields:
        AsyncSession: 비동기 SQLAlchemy 세션
        
    Examples:
        ```python
        async with get_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
        ```
        
        또는 FastAPI 의존성 주입 시:
        
        ```python
        @app.get("/users/{user_id}")
        async def get_user(user_id: int, session: AsyncSession = Depends(get_session)):
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
        ```
    """
    session_factory = await get_session_factory()
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close() 