from fastapi import APIRouter, HTTPException
from app.domain.controller.chat_controller import generate_response
from app.domain.model.chat_model import ChatRequest, ChatResponse

# 라우터 설정
router = APIRouter()

# 엔드포인트 정의
@router.get("/hello")
async def hello_world():
    """
    간단한 Hello World 메시지를 반환합니다. 서비스 동작 테스트용입니다.
    """
    return {"message": "Hello World from Chatbot Service!", "status": "success"}

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    사용자 메시지에 대한 응답을 생성합니다.
    
    - **message**: 사용자가 보낸 메시지
    - **user_id**: 사용자 식별자 (선택 사항)
    
    **Returns**:
    - **response**: 챗봇의 응답 메시지
    - **status**: 요청 처리 상태
    """
    try:
        response = generate_response(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")
