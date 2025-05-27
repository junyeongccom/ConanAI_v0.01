# irsummary_service.py 
import os
import re
import camelot
import pdfplumber
from typing import Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
from app.foundation.pdf_parser import (
    extract_first_page_text,
    extract_text_from_pdf,
    extract_tables_from_pdf,
    find_financial_forecast_table,
    extract_periods_from_table,
    extract_financial_data_from_table,
    extract_investment_info_from_text
)
from app.platform.openai_client import summarize_ir_report_content
from app.domain.model.irsummary_schema import IRSummaryResult

# 환경변수 로드
load_dotenv()

class IRSummaryService:
    """IR 요약 서비스 클래스"""
    
    def __init__(self):
        """IRSummary 서비스 초기화"""
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def extract_investment_opinion(self, pdf_path: str) -> Dict[str, str]:
        """
        PDF의 첫 페이지에서 투자의견, 목표주가, 타겟 PER을 추출합니다.
        
        Args:
            pdf_path (str): PDF 파일 경로
            
        Returns:
            Dict[str, str]: 투자의견 정보
        """
        try:
            # foundation 모듈을 사용하여 첫 페이지 텍스트 추출
            first_page_text = extract_first_page_text(pdf_path)
            
            # foundation 모듈을 사용하여 투자 정보 추출
            return extract_investment_info_from_text(first_page_text)
            
        except Exception as e:
            print(f"투자의견 추출 중 오류 발생: {e}")
            return {
                "opinion": "",
                "target_price": "",
                "target_per": ""
            }
    
    def extract_financial_forecast(self, pdf_path: str) -> Dict[str, Dict[str, float]]:
        """
        PDF에서 Camelot을 사용하여 재무 전망 테이블을 추출합니다.
        
        Args:
            pdf_path (str): PDF 파일 경로
            
        Returns:
            Dict[str, Dict[str, float]]: 연도별 재무 전망 데이터
        """
        try:
            # foundation 모듈을 사용하여 테이블 추출
            tables = extract_tables_from_pdf(pdf_path, flavor='stream')
            
            if not tables:
                return {}
            
            # 재무 전망 테이블 찾기
            forecast_table = find_financial_forecast_table(tables)
            
            if forecast_table is None:
                return {}
            
            # 기간별 컬럼 인덱스 추출
            period_indices = extract_periods_from_table(forecast_table)
            
            if not period_indices:
                return {}
            
            # 재무 데이터 추출
            return extract_financial_data_from_table(forecast_table, period_indices)
            
        except Exception as e:
            print(f"재무 전망 추출 중 오류 발생: {e}")
            return {}
    
    def summarize_main_contents(self, pdf_path: str) -> str:
        """
        PDF의 첫 1-2페이지 본문을 GPT-3.5-turbo로 요약합니다.
        
        Args:
            pdf_path (str): PDF 파일 경로
            
        Returns:
            str: 요약된 내용
        """
        try:
            # foundation 모듈을 사용하여 텍스트 추출 (첫 2페이지)
            full_text = extract_text_from_pdf(pdf_path, pages=[0, 1])
            
            if not full_text.strip():
                return "텍스트를 추출할 수 없습니다."
            
            # platform 모듈을 사용하여 요약
            return summarize_ir_report_content(full_text)
            
        except Exception as e:
            print(f"본문 요약 중 오류 발생: {e}")
            return f"요약 생성 중 오류가 발생했습니다: {str(e)}"
    
    def analyze_ir_report(self, pdf_path: str) -> IRSummaryResult:
        """
        IR 리포트를 종합적으로 분석합니다.
        
        Args:
            pdf_path (str): PDF 파일 경로
            
        Returns:
            IRSummaryResult: 분석 결과
        """
        try:
            # 1. 투자의견 추출
            investment_opinion = self.extract_investment_opinion(pdf_path)
            
            # 2. 재무 전망 추출
            financial_forecast = self.extract_financial_forecast(pdf_path)
            
            # 3. 본문 요약
            summary = self.summarize_main_contents(pdf_path)
            
            return IRSummaryResult(
                investment_opinion=investment_opinion,
                forecast=financial_forecast,
                summary=summary
            )
            
        except Exception as e:
            print(f"IR 리포트 분석 중 오류 발생: {e}")
            return IRSummaryResult(
                investment_opinion={
                    "opinion": "",
                    "target_price": "",
                    "target_per": ""
                },
                forecast={},
                summary=f"분석 중 오류가 발생했습니다: {str(e)}"
            )

# 서비스 인스턴스 생성을 위한 팩토리 함수
def get_irsummary_service() -> IRSummaryService:
    """IRSummary 서비스 인스턴스를 반환합니다."""
    return IRSummaryService() 