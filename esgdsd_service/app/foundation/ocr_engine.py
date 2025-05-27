import pytesseract
from PIL import Image
import os

def extract_text_from_image(image: Image.Image) -> str:
    """
    이미지에서 텍스트를 추출합니다.

    Args:
        image (Image.Image): 텍스트를 추출할 이미지

    Returns:
        str: 추출된 텍스트

    Raises:
        RuntimeError: OCR 처리 중 오류가 발생한 경우
    """
    try:
        # Tesseract OCR 설정
        # --oem 3: LSTM OCR Engine Mode
        # --psm 6: Assume a single uniform block of text
        custom_config = r'--oem 3 --psm 6'
        
        # 한글과 영어 모두 인식하도록 설정
        text = pytesseract.image_to_string(
            image,
            config=custom_config,
            lang='kor+eng'  # 한글과 영어 모두 인식
        )
        
        return text
    except Exception as e:
        raise RuntimeError(f"OCR processing failed: {str(e)}") 