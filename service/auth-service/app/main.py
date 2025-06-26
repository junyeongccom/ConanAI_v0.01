from fastapi import FastAPI
from app.api.auth_router import router
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
    title="Auth Service",
    description="Sky-C 프로젝트의 사용자 인증 및 계정 관리 서비스",
    version="1.0.0"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Auth Service is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "auth-service"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8084,
        reload=True
    ) 