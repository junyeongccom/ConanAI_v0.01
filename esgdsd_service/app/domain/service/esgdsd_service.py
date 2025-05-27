from typing import Dict, Any
from app.foundation.pdf_loader import convert_pdf_to_image
from app.foundation.ocr_engine import extract_text_from_image
from app.foundation.text_cleaner import clean_text

class ESGDSDService:
    def __init__(self):
        """
        ESGDSD 서비스를 초기화합니다.
        """
        pass

    def extract_text_from_pdf(self, pdf_path: str, page_num: int) -> Dict[str, Any]:
        """
        PDF 파일의 특정 페이지에서 텍스트를 추출합니다.

        Args:
            pdf_path (str): PDF 파일 경로
            page_num (int): 추출할 페이지 번호 (1-based)

        Returns:
            Dict[str, Any]: 추출된 텍스트 정보를 담은 딕셔너리
                {
                    "page_number": int,
                    "total_text": str
                }
        """
        # PDF를 이미지로 변환
        image = convert_pdf_to_image(pdf_path, page_num)
        
        # 이미지에서 텍스트 추출
        raw_text = extract_text_from_image(image)
        print(f"\n=== 원본 텍스트 (페이지 {page_num}) ===")
        print(raw_text)
        
        # 텍스트 정리
        cleaned_text = clean_text(raw_text)
        print(f"\n=== 정리된 텍스트 (페이지 {page_num}) ===")
        print(cleaned_text)
        
        return {
            "page_number": page_num,
            "total_text": cleaned_text
        } 