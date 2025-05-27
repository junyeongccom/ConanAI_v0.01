from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.esgdsd_router import router as esgdsd_router

app = FastAPI(
    title="ESG DSD Service",
    description="PDF에서 표를 추출해 JSON으로 변환하는 AI 기반 서비스",
    version="0.1.0"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프론트엔드 origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(esgdsd_router, prefix="/esgdsd", tags=["ESG DSD"])

