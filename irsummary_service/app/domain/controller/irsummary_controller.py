# irsummary_controller.py 
from app.domain.service.irsummary_service import get_irsummary_service
from app.domain.model.irsummary_schema import IRSummaryResult

class IRSummaryController:
    """IR 요약 컨트롤러 - 도메인 서비스 호출만 담당"""
    
    def __init__(self):
        self.service = get_irsummary_service()
    
    def analyze(self, pdf_path: str) -> IRSummaryResult:
        """
        IR 리포트를 분석합니다.
        
        Args:
            pdf_path (str): PDF 파일 경로
            
        Returns:
            IRSummaryResult: 분석 결과
        """
        return self.service.analyze_ir_report(pdf_path)

# 컨트롤러 인스턴스 생성을 위한 팩토리 함수
def get_irsummary_controller() -> IRSummaryController:
    """IRSummary 컨트롤러 인스턴스를 반환합니다."""
    return IRSummaryController() 