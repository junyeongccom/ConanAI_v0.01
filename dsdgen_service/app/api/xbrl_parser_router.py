from fastapi import APIRouter, Query
from app.domain.controller.xbrl_parser_controller import XBRLParserController
from typing import Dict, Any

router = APIRouter(prefix="/xbrl-parser", tags=["XBRL Parser"])
controller = XBRLParserController()

@router.get("/xbrl-to-dataframe")
async def get_xbrl_to_dataframe(
    corp_code: str = Query(..., description="기업 고유번호 (예: 00000000)")
) -> Dict[str, Any]:
    """
    기업 고유번호를 기반으로 XBRL 데이터를 파싱하여 데이터프레임 형태로 변환한 결과를 JSON 형식으로 반환합니다.
    데이터는 자동으로 데이터베이스에도 저장됩니다.
    
    Args:
        corp_code: 기업 고유번호
        
    Returns:
        Dict[str, Any]: XBRL 데이터가 포함된 응답
        
    Raises:
        HTTPException: 데이터 처리 중 오류 발생 시
    """
    # 비동기로 컨트롤러 메서드 호출
    result = await controller.get_xbrl_to_dataframe(corp_code)
    return result