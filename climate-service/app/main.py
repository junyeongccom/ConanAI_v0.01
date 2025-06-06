"""
기후 데이터 서비스 - FastAPI 메인 애플리케이션
Task 001: 프로젝트 기반 인프라 구축 구현
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.climate_router import router as climate_router
from contextlib import asynccontextmanager
import uvicorn
import os
import logging
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# 기본 로거 설정
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 라이프사이클 관리"""
    # 시작 시
    logger.info("🌍 기후 데이터 서비스 시작 중...")
    
    yield
    
    # 종료 시
    logger.info("🛑 기후 데이터 서비스 종료 중...")


# FastAPI 앱 생성
app = FastAPI(
    title="기후 데이터 서비스",
    description="SSP 시나리오 기반 기후변화 데이터 전처리 및 분석 API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(climate_router)


@app.get("/")
async def root():
    """서비스 상태 확인"""
    return {
        "service": "기후 데이터 서비스",
        "status": "running",
        "version": "1.0.0",
        "description": "SSP 시나리오 기반 기후변화 데이터 처리"
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "service": "climate-service"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8087))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 