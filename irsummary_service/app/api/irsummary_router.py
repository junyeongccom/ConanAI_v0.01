# irsummary_router.py 
from fastapi import APIRouter, UploadFile, File
from app.domain.controller.irsummary_controller import get_irsummary_controller
from app.domain.model.irsummary_schema import IRAnalysisResponse
from app.foundation.file_utils import process_uploaded_pdf, cleanup_file

router = APIRouter()

# 컨트롤러 인스턴스
controller = get_irsummary_controller()

@router.get("/health")
async def health_check():
    """
    IRSummary 서비스 헬스체크 엔드포인트
    """
    return {"message": "Hello World from irsummary_service"}

@router.get("/")
async def get_irsummary_info():
    """
    IRSummary 서비스 정보 조회
    """
    return {
        "service": "irsummary_service",
        "version": "1.0.0",
        "description": "IR 리포트 분석 및 요약 서비스",
        "endpoints": [
            "/api/irsummary/health",
            "/api/irsummary/",
            "/api/irsummary/pdfsummary"
        ]
    }

@router.post("/pdfsummary", response_model=IRAnalysisResponse)
async def analyze_pdf(file: UploadFile = File(...)) -> IRAnalysisResponse:
    """
    PDF 파일을 업로드하고 IR 리포트를 분석합니다.
    
    Args:
        file (UploadFile): 업로드할 PDF 파일
        
    Returns:
        IRAnalysisResponse: 분석 결과
        
    Example:
        curl -X POST "http://localhost:8083/api/irsummary/pdfsummary" \
             -H "accept: application/json" \
             -H "Content-Type: multipart/form-data" \
             -F "file=@report.pdf"
    """
    temp_file_path = None
    try:
        # 파일 처리 (유효성 검사, 임시 저장)
        temp_file_path, _ = await process_uploaded_pdf(file)
        
        # 컨트롤러를 통한 도메인 로직 실행
        result = controller.analyze(temp_file_path)
        
        return IRAnalysisResponse(
            success=True,
            message="IR 리포트 분석이 완료되었습니다.",
            data=result
        )
        
    except Exception as e:
        return IRAnalysisResponse(
            success=False,
            message=f"분석 중 오류가 발생했습니다: {str(e)}",
            data=None
        )
        
    finally:
        # 임시 파일 정리
        cleanup_file(temp_file_path)

