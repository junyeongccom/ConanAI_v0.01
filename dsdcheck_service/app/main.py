import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.dsdfooting_router import router as dsdfooting_router
from .api.dsdcheck_router import router as dsdcheck_router

# 환경변수 로딩
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(
    title="재무제표 검증 서비스",
    version="1.0.0",
    description="DSD 공시용 재무데이터 검증 서비스"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(dsdfooting_router)
app.include_router(dsdcheck_router, prefix="/api/dsdcheck")

@app.get("/")
async def root():
    return {"message": "재무제표 검증 서비스 API"} 