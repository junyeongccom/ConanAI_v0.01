# service_type.py
import os
from enum import Enum

class ServiceType(str, Enum):
    CHATBOT = "chatbot"
    CLIMATE = "climate-service"
    N8N = "n8n"

SERVICE_URLS = {
    ServiceType.CHATBOT: os.getenv("CHATBOT_SERVICE_URL", "http://chatbot:8081"),
    ServiceType.CLIMATE: os.getenv("CLIMATE_SERVICE_URL", "http://climate-service:8087"),
    ServiceType.N8N: os.getenv("N8N_SERVICE_URL", "http://n8n:5678"),
}
