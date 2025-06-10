from fastapi import APIRouter

# APIRouter 인스턴스 생성
router = APIRouter()

@router.get("/health")
async def health_check():
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: 서비스 상태 메시지
    """
    return {"message": "Hello World from finimpact-service"} 