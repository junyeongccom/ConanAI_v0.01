from app.domain.service.xbrl_parser_service import XBRLParserService
from typing import Dict, Any

class XBRLParserController:
    def __init__(self):
        self.service = XBRLParserService()

    async def get_xbrl_to_dataframe(self, corp_code: str) -> Dict[str, Any]:
        """
        XBRL 데이터를 파싱하여 데이터프레임 결과를 JSON 형식으로 변환하여 반환합니다.
        
        Args:
            corp_code: 기업 고유번호
            
        Returns:
            Dict[str, Any]: XBRL 데이터
            
        Raises:
            Exception: 데이터 파싱 또는, DB 처리 중 오류 발생 시
        """
        # 비동기로 서비스 메서드 호출
        df = await self.service.get_xbrl_to_dataframe(corp_code)
        
        if df.empty:
            return {"success": False, "message": "데이터를 찾을 수 없습니다.", "data": []}
        
        # DataFrame을 JSON 형식으로 변환
        xbrl_data = df.to_dict(orient='records')
        
        return {
            "success": True,
            "message": f"XBRL 데이터 {len(xbrl_data)}개 항목이 추출되었습니다.",
            "data": xbrl_data
        }
