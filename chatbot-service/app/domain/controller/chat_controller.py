from app.domain.service.chat_service import ChatService

chat_service = ChatService()

async def generate_response(message: str) -> str:
    chat_request = {"message": message}
    return await chat_service.generate_response(chat_request) 