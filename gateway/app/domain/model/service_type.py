# service_type.py
import os
from enum import Enum

class ServiceType(str, Enum):
    CHATBOT = "chatbot"
    REPORT = "report"
    DISCLOSURE = "disclosure"
    AUTH = "auth"
    CLIMATE = "climate-service"
    N8N = "n8n"

SERVICE_URLS = {
    ServiceType.CHATBOT: os.getenv("CHATBOT_SERVICE_URL", "http://chatbot:8081"),
    ServiceType.REPORT: os.getenv("REPORT_SERVICE_URL", "http://report:8082"),
    ServiceType.DISCLOSURE: os.getenv("DISCLOSURE_SERVICE_URL", "http://disclosure:8083"),
    ServiceType.AUTH: os.getenv("AUTH_SERVICE_URL", "http://auth:8084"),
    ServiceType.CLIMATE: os.getenv("CLIMATE_SERVICE_URL", "http://climate-service:8087"),
    ServiceType.N8N: os.getenv("N8N_SERVICE_URL", "http://n8n:5678"),
}
