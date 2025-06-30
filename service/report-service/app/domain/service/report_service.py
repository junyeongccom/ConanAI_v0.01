import logging
from app.foundation.disclosure_service_client import DisclosureServiceClient

logger = logging.getLogger(__name__)

class ReportService:
    def __init__(self, disclosure_client: DisclosureServiceClient):
        self.disclosure_client = disclosure_client

    async def generate_report(self, user_id: str):
        logger.info(f"사용자 답변 데이터 가져오기 시작: user_id={user_id}")
        answers = await self.disclosure_client.get_my_answers(user_id)

        if answers is None:
            logger.error(f"disclosure-service로부터 답변을 가져오는 데 실패했습니다: user_id={user_id}")
            return None
        
        logger.info(f"답변 데이터 {len(answers)}개 수신 성공: user_id={user_id}")
        
        # TODO: 받아온 답변 데이터를 기반으로 보고서를 생성하는 로직 구현
        
        return {"message": "Report generation logic is not implemented yet."} 