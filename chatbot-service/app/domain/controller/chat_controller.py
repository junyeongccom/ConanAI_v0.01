from app.domain.service.chat_service import ChatService
from app.domain.model.chat_schema import ChatRequest, ChatResponse

class ChatController:
    def __init__(self, chat_service: ChatService = None):
        self.chat_service = ChatService()

    async def get_chatbot_response(self, request: ChatRequest) -> ChatResponse:
        """
        챗봇 서비스로부터 응답을 받습니다.
        """
        user_message = request.message
        bot_response = await self.chat_service.get_response_from_model(user_message)
        return ChatResponse(response=bot_response)