# 인증 관련 API 라우터 
from fastapi import APIRouter
from pydantic import BaseModel

# APIRouter 인스턴스 생성
auth_router = APIRouter(
    prefix="",
    tags=["Authentication"]
)

# 응답 모델 정의
class HealthResponse(BaseModel):
    message: str

@auth_router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: Hello World 메시지
    """
    return {"message": "Hello World from auth-service"} 