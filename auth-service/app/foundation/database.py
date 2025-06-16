"""
데이터베이스 연결 및 세션 관리
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 데이터베이스 연결 설정
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://hc_user:hc_password@postgres:5432/hc_db"
)

# SQLAlchemy 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 로컬 클래스 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

def get_db() -> Session:
    """
    데이터베이스 세션을 생성하고 반환하는 의존성 함수
    FastAPI의 Depends와 함께 사용됨
    
    Yields:
        Session: 데이터베이스 세션
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    데이터베이스 테이블 생성
    """
    Base.metadata.create_all(bind=engine)

def get_database_url() -> str:
    """
    현재 데이터베이스 URL 반환
    
    Returns:
        str: 데이터베이스 연결 URL
    """
    return DATABASE_URL 