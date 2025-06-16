from fastapi import FastAPI
from app.api.auth_router import auth_router
import uvicorn
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("auth_service")

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title="Auth Service API",
    description="사용자 인증 및 계정 관리 마이크로서비스",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# auth_router를 애플리케이션에 포함
app.include_router(auth_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8084,
        reload=True
    ) 