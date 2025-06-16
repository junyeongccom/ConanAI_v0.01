# app/data_preprocessing.py

import re
# from html import unescape # 필요시 주석 해제

def clean_text_for_training(text: str) -> str:
    """
    훈련 데이터에서 불필요한 URL, 출처, 그림/표 참조, 자문자답 패턴 등을 제거합니다.
    """
    # 1. HTML 엔티티 디코딩 (예: &quot; -> ")
    # if 'unescape' in globals():
    #     text = unescape(text)
    text = text.replace('&quot;', '"')

    # 2. URL 제거 (HTTP/HTTPS, www 포함)
    url_pattern = r'https?://(?:www\.)?\S+\.(?:com|org|net|gov|edu|co\.kr|jp|html|pdf|txt|php|asp|htm|xml|xlsx|docx|zip|rar)(?:\S*)?'
    text = re.sub(url_pattern, '', text)

    # 3. [출처], |작성자 패턴 제거 (다양한 조합 및 줄바꿈 고려)
    source_author_pattern = r'\[출처\].*?\|작성자\s*\S+|\[출처\].*?|\|작성자\s*\S+'
    text = re.sub(source_author_pattern, '', text, flags=re.DOTALL)

    # 4. [그림 X], [표 X] 패턴 제거
    figure_table_pattern = r'\[그림\s*\d+\]|\[표\s*\d+\]'
    text = re.sub(figure_table_pattern, '', text)

    # 5. 자문자답 Q/A 패턴 제거 (Qx., Ax. 포함)
    q_a_pattern = r'\b(?:Q\d*\.\s*|A\d*[-]\d*\.\s*|Q\.\s*|A\.\s*)'
    text = re.sub(q_a_pattern, '', text)

    # 6. 불필요한 공백 및 구두점 정리 강화 (순서 중요)
    text = re.sub(r'\s{2,}', ' ', text).strip()
    text = re.sub(r'([.,!?;])\s*\1+', r'\1', text)
    text = re.sub(r'\s*([.,!?;])', r'\1', text)
    text = re.sub(r'([.,!?;])\s*([가-힣a-zA-Z0-9])', r'\1 \2', text)
    text = text.strip()

    return text