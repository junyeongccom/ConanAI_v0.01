# main.py 
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.irsummary_router import router as irsummary_router

# 환경변수 로드
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# FastAPI 인스턴스 생성
app = FastAPI(
    title="IRSummary Service",
    description="IR 리포트 분석 및 요약 마이크로서비스",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프론트엔드 origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(irsummary_router, prefix="/api/irsummary", tags=["irsummary"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8083))
    uvicorn.run(app, host="0.0.0.0", port=port) 