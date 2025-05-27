from pdf2image import convert_from_path
import os
from PIL import Image

def convert_pdf_to_image(pdf_path: str, page_num: int) -> Image.Image:
    """
    PDF 파일의 특정 페이지를 이미지로 변환합니다.

    Args:
        pdf_path (str): PDF 파일 경로
        page_num (int): 변환할 페이지 번호 (1-based)

    Returns:
        Image.Image: 변환된 이미지 객체

    Raises:
        FileNotFoundError: PDF 파일이 존재하지 않는 경우
        ValueError: 페이지 번호가 유효하지 않은 경우
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    # PDF를 이미지로 변환
    images = convert_from_path(pdf_path)
    
    # 페이지 번호 검증
    if page_num < 1 or page_num > len(images):
        raise ValueError(f"Invalid page number. Total pages: {len(images)}")
    
    # 1-based to 0-based index
    return images[page_num - 1] 