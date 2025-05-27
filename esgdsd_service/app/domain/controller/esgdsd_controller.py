from typing import Dict, Any
from fastapi import UploadFile
from app.domain.service.esgdsd_service import ESGDSDService
from app.foundation.pdf_storage import save_temp_pdf_file, delete_temp_file

class ESGDSDController:
    def __init__(self):
        self.service = ESGDSDService()

    async def extract_text(self, file: UploadFile, page_num: int) -> Dict[str, Any]:
        """
        PDF 파일에서 텍스트를 추출하는 요청을 처리합니다.

        Args:
            file (UploadFile): 업로드된 PDF 파일
            page_num (int): 추출할 페이지 번호

        Returns:
            Dict[str, Any]: 추출된 텍스트 정보
        """
        pdf_path = await save_temp_pdf_file(file)
        try:
            result = self.service.extract_text_from_pdf(pdf_path, page_num)
            return {
                "status": "success",
                "data": result
            }
        finally:
            delete_temp_file(pdf_path) 