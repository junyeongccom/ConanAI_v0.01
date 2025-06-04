# service_type.py
import os
from enum import Enum

class ServiceType(str, Enum):
    STOCKTREND = "stocktrend"
    IRSUMMARY = "irsummary"
    CHATBOT = "chatbot"
    ESGDSD = "esgdsd"
    DSDGEN = "dsdgen"
    DSDCHECK = "dsdcheck"

SERVICE_URLS = {
    ServiceType.STOCKTREND: os.getenv("STOCKTREND_SERVICE_URL", "http://stocktrend:8081"),
    ServiceType.IRSUMMARY: os.getenv("IRSUMMARY_SERVICE_URL", "http://irsummary:8083"),
    ServiceType.CHATBOT: os.getenv("CHATBOT_SERVICE_URL", "http://chatbot:8082"),
    ServiceType.ESGDSD: os.getenv("ESGDSD_SERVICE_URL", "http://esgdsd:8084"),
    ServiceType.DSDGEN: os.getenv("DSDGEN_SERVICE_URL", "http://dsdgen:8085"),
    ServiceType.DSDCHECK: os.getenv("DSDCHECK_SERVICE_URL", "http://dsdcheck:8086"),
}
