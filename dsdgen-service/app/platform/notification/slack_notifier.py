"""
Slack 알림 플랫폼 모듈

n8n Webhook을 통해 Slack 알림을 전송하는 기능을 제공합니다.
"""
import httpx
import logging
from typing import Dict, Any, Optional
import os

# 로거 설정
logger = logging.getLogger(__name__)

class SlackNotifier:
    """
    Slack 알림 전송 클래스
    
    n8n Webhook을 통해 Slack 채널로 알림을 전송합니다.
    """
    
    def __init__(self, webhook_url: Optional[str] = None):
        """
        SlackNotifier 초기화
        
        Args:
            webhook_url: n8n Webhook URL (기본값: 환경변수 또는 localhost:5678)
        """
        self.webhook_url = webhook_url or os.getenv(
            "N8N_WEBHOOK_URL", 
            "http://localhost:5678/webhook/slack-notification"
        )
        
    async def send_notification(self, **kwargs) -> bool:
        """
        n8n으로 알림 데이터를 전송합니다.
        
        Args:
            **kwargs: 전송할 데이터
            
        Returns:
            bool: 전송 성공 여부
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                logger.info("n8n 알림 전송 시도")
                
                response = await client.post(
                    self.webhook_url,
                    json=kwargs,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    logger.info("n8n 알림 전송 성공")
                    return True
                else:
                    logger.error(
                        "n8n 알림 전송 실패 - HTTP %d: %s", 
                        response.status_code, 
                        response.text
                    )
                    return False
                    
        except httpx.TimeoutException:
            logger.error("n8n 알림 전송 타임아웃")
            return False
        except Exception as e:
            logger.error("n8n 알림 전송 오류: %s", str(e))
            return False


# 전역 인스턴스 (재사용을 위해)
_slack_notifier = None

def get_slack_notifier() -> SlackNotifier:
    """
    SlackNotifier 싱글톤 인스턴스를 반환합니다.
    
    Returns:
        SlackNotifier: 슬랙 노티파이어 인스턴스
    """
    global _slack_notifier
    if _slack_notifier is None:
        _slack_notifier = SlackNotifier()
    return _slack_notifier


async def send_slack_notification(**kwargs) -> bool:
    """
    간편 Slack 알림 전송 함수
    
    Args:
        **kwargs: 전송할 데이터
        
    Returns:
        bool: 전송 성공 여부
    """
    notifier = get_slack_notifier()
    return await notifier.send_notification(**kwargs) 