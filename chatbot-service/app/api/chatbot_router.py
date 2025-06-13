from fastapi import APIRouter, HTTPException, Depends, status
from app.domain.controller.chat_controller import ChatController
from app.domain.service.chat_service import ChatService
from app.domain.model.chat_schema import ChatRequest, ChatResponse

# 라우터 설정
router = APIRouter()

# Dependency injection을 위한 함수
def get_chat_controller() -> ChatController:
    """ChatController 인스턴스를 반환합니다."""
    return ChatController()

# 엔드포인트 정의
@router.get("/hello")
async def hello_world():
    """
    간단한 Hello World 메시지를 반환합니다. 서비스 동작 테스트용입니다.
    """
    return {"message": "Hello World from Chatbot Service!", "status": "success"}

@router.post("/", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_bot(
    request: ChatRequest,
    controller: ChatController = Depends(get_chat_controller)
) -> ChatResponse:
    """
    챗봇과 대화합니다.
    """
    try:
        response = await controller.get_chatbot_response(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}"
        )