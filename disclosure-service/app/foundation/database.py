# disclosure-service/app/foundation/database.py
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import logging

# 환경변수 로드
load_dotenv()

logger = logging.getLogger(__name__)

# 데이터베이스 URL 설정
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # 기본값 설정 (개발 환경용)
    DATABASE_URL = "postgresql://hc_user:hc_password@localhost:5432/hc_db"
    logger.warning("DATABASE_URL environment variable is not set. Using default connection string.")

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=os.getenv("SQL_DEBUG", "false").lower() == "true"
)

# 세션 로컬 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    데이터베이스 세션 의존성
    FastAPI 의존성으로 사용
    """
    db: Session = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"데이터베이스 세션 오류: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """
    데이터베이스 테이블 생성
    초기 테이블 스키마 생성용 (선택사항, Docker init SQL 사용 시)
    """
    from app.domain.model.disclosure_entity import Base
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ 데이터베이스 테이블 생성 완료")
    except Exception as e:
        logger.error(f"❌ 데이터베이스 테이블 생성 실패: {str(e)}")
        raise


def check_database_connection() -> bool:
    """데이터베이스 연결 상태 확인"""
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
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