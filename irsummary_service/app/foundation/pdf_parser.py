import re
import camelot
import pdfplumber
from typing import Dict, List, Any, Optional
import pandas as pd

def extract_text_from_pdf(pdf_path: str, pages: List[int] = None) -> str:
    """
    PDF에서 텍스트를 추출합니다.
    
    Args:
        pdf_path (str): PDF 파일 경로
        pages (List[int], optional): 추출할 페이지 번호 리스트. None이면 첫 2페이지
        
    Returns:
        str: 추출된 텍스트
    """
    try:
        full_text = ""
        with pdfplumber.open(pdf_path) as pdf:
            if pages is None:
                # 기본적으로 첫 2페이지 추출
                pages_to_extract = min(2, len(pdf.pages))
                pages = list(range(pages_to_extract))
            
            for page_num in pages:
                if page_num < len(pdf.pages):
                    page = pdf.pages[page_num]
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n\n"
        
        return full_text.strip()
    except Exception as e:
        print(f"PDF 텍스트 추출 중 오류 발생: {e}")
        return ""

def extract_first_page_text(pdf_path: str) -> str:
    """
    PDF의 첫 페이지 텍스트만 추출합니다.
    
    Args:
        pdf_path (str): PDF 파일 경로
        
    Returns:
        str: 첫 페이지 텍스트
    """
    return extract_text_from_pdf(pdf_path, pages=[0])

def extract_tables_from_pdf(pdf_path: str, flavor: str = 'stream') -> List[pd.DataFrame]:
    """
    Camelot을 사용하여 PDF에서 테이블을 추출합니다.
    
    Args:
        pdf_path (str): PDF 파일 경로
        flavor (str): Camelot flavor ('stream' 또는 'lattice')
        
    Returns:
        List[pd.DataFrame]: 추출된 테이블들의 리스트
    """
    try:
        tables = camelot.read_pdf(pdf_path, flavor=flavor, pages='all')
        return [table.df for table in tables]
    except Exception as e:
        print(f"PDF 테이블 추출 중 오류 발생: {e}")
        return []

def find_financial_forecast_table(tables: List[pd.DataFrame]) -> Optional[pd.DataFrame]:
    """
    재무 전망 테이블을 찾습니다.
    
    Args:
        tables (List[pd.DataFrame]): 테이블 리스트
        
    Returns:
        Optional[pd.DataFrame]: 재무 전망 테이블 (없으면 None)
    """
    for df in tables:
        # 테이블이 실적 전망 테이블인지 확인
        table_text = ' '.join(df.values.flatten().astype(str))
        if any(keyword in table_text for keyword in ['실적', '전망', '매출', '영업이익', '2Q24', '2025F', '2026F']):
            return df
    return None

def extract_periods_from_table(df: pd.DataFrame) -> Dict[str, int]:
    """
    테이블에서 기간별 컬럼 인덱스를 찾습니다.
    
    Args:
        df (pd.DataFrame): 테이블 데이터프레임
        
    Returns:
        Dict[str, int]: 기간별 컬럼 인덱스 매핑
    """
    period_indices = {}
    
    # 헤더 행 찾기
    for i, row in df.iterrows():
        row_text = ' '.join(row.astype(str))
        if any(period in row_text for period in ['2Q24', '2025F', '2026F']):
            headers = df.iloc[i].tolist()
            
            # 각 기간별 컬럼 인덱스 찾기
            for j, header in enumerate(headers):
                header_str = str(header)
                if '2Q24' in header_str:
                    period_indices['2Q24'] = j
                elif '2025F' in header_str:
                    period_indices['2025F'] = j
                elif '2026F' in header_str:
                    period_indices['2026F'] = j
            break
    
    return period_indices

def extract_financial_data_from_table(df: pd.DataFrame, period_indices: Dict[str, int]) -> Dict[str, Dict[str, float]]:
    """
    테이블에서 재무 데이터를 추출합니다.
    
    Args:
        df (pd.DataFrame): 테이블 데이터프레임
        period_indices (Dict[str, int]): 기간별 컬럼 인덱스
        
    Returns:
        Dict[str, Dict[str, float]]: 기간별 재무 데이터
    """
    result = {}
    
    # 헤더 행 찾기
    header_row = None
    for i, row in df.iterrows():
        row_text = ' '.join(row.astype(str))
        if any(period in row_text for period in ['2Q24', '2025F', '2026F']):
            header_row = i
            break
    
    if header_row is None:
        return result
    
    # 매출과 영업이익 행 찾기
    for i in range(header_row + 1, len(df)):
        row = df.iloc[i]
        first_col = str(row.iloc[0]).strip()
        
        # 매출 관련 키워드
        if any(keyword in first_col for keyword in ['매출', '영업수익', '수익', 'Revenue']):
            for period, col_idx in period_indices.items():
                if period not in result:
                    result[period] = {}
                try:
                    value = extract_numeric_value(str(row.iloc[col_idx]))
                    if value is not None:
                        result[period]['매출'] = value
                except (IndexError, ValueError):
                    pass
        
        # 영업이익 관련 키워드
        elif any(keyword in first_col for keyword in ['영업이익', 'Operating', '영업수익']):
            for period, col_idx in period_indices.items():
                if period not in result:
                    result[period] = {}
                try:
                    value = extract_numeric_value(str(row.iloc[col_idx]))
                    if value is not None:
                        result[period]['영업이익'] = value
                except (IndexError, ValueError):
                    pass
    
    return result

def extract_numeric_value(text: str) -> Optional[float]:
    """
    텍스트에서 숫자 값을 추출합니다.
    
    Args:
        text (str): 추출할 텍스트
        
    Returns:
        Optional[float]: 추출된 숫자 값 (실패시 None)
    """
    try:
        # 쉼표 제거 후 숫자만 추출
        cleaned = re.sub(r'[^\d.-]', '', text)
        if cleaned and cleaned != '-':
            return float(cleaned)
    except (ValueError, TypeError):
        pass
    return None

def extract_investment_info_from_text(text: str) -> Dict[str, str]:
    """
    텍스트에서 투자 정보를 추출합니다.
    
    Args:
        text (str): 분석할 텍스트
        
    Returns:
        Dict[str, str]: 투자 정보 (opinion, target_price, target_per)
    """
    result = {
        "opinion": "",
        "target_price": "",
        "target_per": ""
    }
    
    if not text:
        return result
    
    # 투자의견 추출
    opinion_patterns = [
        r'투자의견[:\s]*([^\n\r]+)',
        r'매수\s*\([^)]*\)',
        r'(매수|중립|매도)\s*\([^)]*\)',
        r'Investment\s*Opinion[:\s]*([^\n\r]+)'
    ]
    
    for pattern in opinion_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            result["opinion"] = match.group(1).strip() if len(match.groups()) > 0 else match.group(0).strip()
            break
    
    # 목표주가 추출
    target_price_patterns = [
        r'목표주가[:\s]*([0-9,]+원?)',
        r'Target\s*Price[:\s]*([0-9,]+원?)',
        r'TP[:\s]*([0-9,]+원?)'
    ]
    
    for pattern in target_price_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            price = match.group(1)
            if not price.endswith('원'):
                price += '원'
            result["target_price"] = price
            break
    
    # PER 추출
    per_patterns = [
        r'PER[:\s]*([0-9.]+)배?',
        r'P/E[:\s]*([0-9.]+)배?',
        r'타겟\s*PER[:\s]*([0-9.]+)배?'
    ]
    
    for pattern in per_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            per_value = match.group(1)
            result["target_per"] = f"{per_value}배"
            break
    
    # EPS와 목표주가로 PER 계산 (직접 PER을 찾지 못한 경우)
    if not result["target_per"] and result["target_price"]:
        eps_match = re.search(r'EPS[:\s]*([0-9,]+)', text, re.IGNORECASE)
        if eps_match:
            try:
                target_price_num = float(re.sub(r'[^\d.]', '', result["target_price"]))
                eps_num = float(re.sub(r'[^\d.]', '', eps_match.group(1)))
                if eps_num > 0:
                    per_calculated = target_price_num / eps_num
                    result["target_per"] = f"{per_calculated:.1f}배"
            except (ValueError, ZeroDivisionError):
                pass
    
    return result 