from fastapi import APIRouter, UploadFile, File, HTTPException
from ..domain.controller.dsdfooting_controller import DSDFootingController
from ..domain.model.dsdfooting_schema import FootingResponse

router = APIRouter(prefix="/api/v1/dsdfooting", tags=["재무제표 검증"])

controller = DSDFootingController()

@router.post("/check-footing", response_model=FootingResponse)
async def check_footing(file: UploadFile = File(...)) -> FootingResponse:
    """
    재무제표 엑셀 파일의 합계검증을 수행합니다.
    
    Args:
        file (UploadFile): 검증할 재무제표 엑셀 파일 (xlsx)
    
    Returns:
        FootingResponse: 검증 결과를 포함하는 JSON 응답
        - total_sheets: 검증된 총 시트 수
        - mismatch_count: 불일치 항목 수
        - results: 시트별 검증 결과 목록
            - sheet: 시트 코드
            - title: 시트 제목
            - results: 항목별 검증 결과
                - item: 항목명
                - expected: 기대값 (합계)
                - actual: 실제값
                - is_match: 일치 여부
                - children: 하위 항목 목록 (재귀적 구조)
    """
    if not file.filename.endswith(('.xls', '.xlsx')):
        raise HTTPException(status_code=400, detail="Excel file required")
        
    try:
        return await controller.check_footing(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/health")
async def health_check():
    return {"message": "Hello World from dsdfooting_service"}

