from fastapi import APIRouter, UploadFile, File, HTTPException
from ..domain.controller.stocktrend_controller import StocktrendController
from ..domain.model.stocktrend_schema import GameCompanyResponse
from typing import Optional

router = APIRouter()
controller = StocktrendController()

@router.post("/report", summary="Upload PDF report")
async def upload_report(
    file: UploadFile = File(..., description="PDF file to upload"),
    description: Optional[str] = None
):
    """
    Upload a PDF report file for processing
    
    Args:
        file: PDF file
        description: Optional description of the report
    
    Returns:
        dict: Processing result with file info
    """
    if not file.content_type == "application/pdf":
        return {"error": "Only PDF files are allowed"}
    
    result = await controller.process_report(file, description)
    return result

@router.get("/stocks", 
    response_model=GameCompanyResponse,
    summary="게임 기업 주가 정보 조회",
    description="국내외 주요 게임 기업들의 실시간 주가 정보와 공시내용을 조회합니다.")
async def get_game_stocks():
    """
    국내외 게임 기업 주가 정보 통합 조회 API
    
    Returns:
        GameCompanyResponse: 게임 기업 주가 정보 목록
    """
    try:
        return await controller.get_game_stocks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
