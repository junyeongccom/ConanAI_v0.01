import httpx
import os
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class DisclosureServiceClient:
    """disclosure-service와의 API 통신을 담당하는 클라이언트"""

    def __init__(self):
        # 환경 변수에서 disclosure-service의 기본 URL을 가져옵니다.
        # Docker Compose 네트워크에서는 서비스 이름으로 통신할 수 있습니다.
        self.base_url = os.getenv("DISCLOSURE_SERVICE_URL", "http://disclosure:8083")

    async def get_my_answers(self, user_id: str) -> Optional[List[Dict[str, Any]]]:
        """
        disclosure-service에 API를 요청하여 특정 사용자의 모든 답변을 가져옵니다.

        Args:
            user_id: 보고서를 생성할 사용자의 ID

        Returns:
            답변 데이터 리스트 또는 실패 시 None
        """
        # disclosure-service 내의 실제 API 경로
        # 참고: 게이트웨이의 /api/disclosure... 가 아닌, 서비스 내부 경로
        api_url = f"{self.base_url}/answers/my" 

        # 서비스 간 통신 시, 게이트웨이가 하던 것처럼 X-User-Id 헤더를 추가하여
        # disclosure-service의 UserContextMiddleware가 사용자를 식별하게 함
        headers = {
            "X-User-Id": str(user_id)  # UUID를 문자열로 변환
        }

        async with httpx.AsyncClient() as client:
            try:
                logger.info(f"disclosure-service에 답변 데이터 요청: user_id={user_id}")
                response = await client.get(api_url, headers=headers)

                # 2xx 상태 코드가 아니면 에러 발생
                response.raise_for_status()  

                logger.info(f"disclosure-service로부터 답변 데이터 수신 완료: user_id={user_id}")
                return response.json()

            except httpx.HTTPStatusError as e:
                logger.error(f"Disclosure Service API 호출 실패: {e.response.status_code} - {e.response.text}")
                return None
            except Exception as e:
                logger.error(f"Disclosure Service 통신 중 예외 발생: {e}")
                return None
    
    async def get_requirement_by_id(self, requirement_id: str) -> Optional[Dict[str, Any]]:
        """
        disclosure-service에 API를 요청하여 특정 요구사항의 상세 정보를 가져옵니다.
        이 정보에는 테이블 헤더를 구성하는 데 필요한 input_schema가 포함됩니다.

        Args:
            requirement_id: 조회할 요구사항의 ID

        Returns:
            요구사항 데이터 딕셔너리 또는 실패 시 None
        """
        api_url = f"{self.base_url}/disclosure-data/requirements/{requirement_id}"

        async with httpx.AsyncClient() as client:
            try:
                logger.info(f"disclosure-service에 요구사항 정보 요청: id={requirement_id}")
                response = await client.get(api_url)
                response.raise_for_status()

                logger.info(f"disclosure-service로부터 요구사항 정보 수신 완료: id={requirement_id}")
                return response.json()

            except httpx.HTTPStatusError as e:
                logger.error(f"Disclosure Service 요구사항 API 호출 실패: {e.response.status_code} - {e.response.text}")
                return None
            except Exception as e:
                logger.error(f"Disclosure Service 요구사항 통신 중 예외 발생: {e}")
                return None 