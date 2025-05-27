import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 라우터 임포트
from app.api.chatbot_router import router as chatbot_router

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("chatbot_service")

# FastAPI 애플리케이션 생성
app = FastAPI(
    title="Chatbot Service",
    description="KoBERT 기반 한국어 챗봇 서비스 API",
    version="1.0.0",
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 ###
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["chatbot"])

# 직접 실행 시 Uvicorn 서버로 실행
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8082"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
