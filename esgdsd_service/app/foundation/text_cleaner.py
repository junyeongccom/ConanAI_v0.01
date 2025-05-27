import re
from typing import List

def clean_text(text: str) -> str:
    """
    OCR로 추출된 텍스트를 정리합니다.

    Args:
        text (str): 정리할 텍스트

    Returns:
        str: 정리된 텍스트
    """
    # 연속된 공백 제거
    text = re.sub(r'\s+', ' ', text)
    
    # 앞뒤 공백 제거
    text = text.strip()
    
    # 특수문자 정리
    text = re.sub(r'[^\w\s가-힣]', '', text)
    
    return text

def split_into_lines(text: str) -> List[str]:
    """
    텍스트를 줄 단위로 분리합니다.

    Args:
        text (str): 분리할 텍스트

    Returns:
        List[str]: 줄 단위로 분리된 텍스트 리스트
    """
    # 줄바꿈으로 분리
    lines = text.split('\n')
    
    # 빈 줄 제거 및 정리
    lines = [clean_text(line) for line in lines if line.strip()]
    
    return lines 