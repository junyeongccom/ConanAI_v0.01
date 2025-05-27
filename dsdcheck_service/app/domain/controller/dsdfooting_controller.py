from fastapi import UploadFile
from ..service.dsdfooting_service import DSDFootingService
from ..model.dsdfooting_schema import FootingResponse
import logging

class DSDFootingController:
    """재무제표 검증 컨트롤러"""
    
    def __init__(self):
        self.service = DSDFootingService()
    
    async def check_footing(self, file: UploadFile) -> FootingResponse:
        """
        재무제표 합계검증 수행
        
        Args:
            file (UploadFile): 검증할 재무제표 엑셀 파일
            
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
        try:
            # 파일 컨텐츠 읽기
            contents = await file.read()
            
            # 서비스 호출하여 검증 수행
            result = self.service.check_footing(contents)
            
            logging.info(f"Successfully validated {result.total_sheets} sheets with {result.mismatch_count} mismatches")
            return result
            
        except Exception as e:
            logging.error(f"Failed to process file {file.filename}: {str(e)}")
            raise
