from app.domain.service.chat_service import ChatService

chat_service = ChatService()

def generate_response(message: str) -> str:
    return chat_service.get_response(message) 