"""
데이터베이스 연결 및 설정
PostgreSQL 연결 관리
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import os
import logging
from typing import Generator

logger = logging.getLogger(__name__)

# 환경변수에서 데이터베이스 설정 읽기
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://hc_user:hc_password@localhost:5432/hc_db"
)

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=os.getenv("SQL_DEBUG", "false").lower() == "true"
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스
Base = declarative_base()


def get_database_session() -> Generator[Session, None, None]:
    """
    데이터베이스 세션 의존성
    FastAPI 의존성으로 사용
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"데이터베이스 세션 오류: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    컨텍스트 매니저로 데이터베이스 세션 관리
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        logger.error(f"데이터베이스 트랜잭션 오류: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def check_database_connection() -> bool:
    """데이터베이스 연결 상태 확인"""
    try:
        with get_db_session() as db:
            db.execute("SELECT 1")
        logger.info("✅ 데이터베이스 연결 성공")
        return True
    except Exception as e:
        logger.error(f"❌ 데이터베이스 연결 실패: {str(e)}")
        return False


def get_database_info() -> dict:
    """데이터베이스 연결 정보 반환"""
    return {
        "database_url": DATABASE_URL.split("@")[1] if "@" in DATABASE_URL else "Unknown",
        "pool_size": engine.pool.size(),
        "checked_out": engine.pool.checkedout(),
        "overflow": engine.pool.overflow(),
        "checked_in": engine.pool.checkedin()
    } 