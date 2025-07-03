import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# 라우터 임포트
from app.api.report_router import router as report_router

# 데이터베이스 및 초기 데이터 로딩 임포트
from app.foundation.database import get_db
from app.foundation.initial_data_loader import run_all_loaders
from app.foundation.user_context_middleware import UserContextMiddleware

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("report_service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI 애플리케이션 생명주기 관리"""
    logger.info("🚀 Report API 서비스 시작")

    # --- 데이터 로딩 로직 ---
    db_session = next(get_db())
    try:
        logger.info("📋 보고서 템플릿 데이터 로딩 시작...")
        run_all_loaders()

    except Exception as e:
        logger.error(f"❌ 서비스 초기화 실패: 데이터 로딩 중 에러 - {e}")
    finally:
        db_session.close()
    # ----------------------

    yield

    logger.info("🛑 Report API 서비스 종료")

# FastAPI 애플리케이션 생성
app = FastAPI(
    title="Report Service",
    description="TCFD 보고서 생성을 위한 서비스 API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 미들웨어 추가
app.add_middleware(UserContextMiddleware)

# 라우터 등록
app.include_router(report_router)

# 직접 실행 시 Uvicorn 서버로 실행
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8082"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 