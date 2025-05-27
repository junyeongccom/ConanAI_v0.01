import os
import re
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

class OpenAIClient:
    def __init__(self):
        """OpenAI 클라이언트 초기화"""
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def summarize_text(self, text: str, max_tokens: int = 200, temperature: float = 0.3) -> str:
        """
        GPT-3.5-turbo를 사용하여 텍스트를 요약합니다.
        
        Args:
            text (str): 요약할 텍스트
            max_tokens (int): 최대 토큰 수
            temperature (float): 생성 온도
            
        Returns:
            str: 요약된 텍스트
        """
        try:
            # 텍스트 전처리
            cleaned_text = self._preprocess_text(text)
            
            if not cleaned_text.strip():
                return "요약할 텍스트가 없습니다."
            
            # 텍스트가 너무 길면 앞부분만 사용 (GPT 토큰 제한 고려)
            if len(cleaned_text) > 3000:
                cleaned_text = cleaned_text[:3000] + "..."
            
            # OpenAI API 호출
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"""다음은 기업 분석 리포트의 본문입니다. 이 내용을 1-3문장으로 요약해주세요. 
                        주요 실적 전망, 투자 포인트, 위험 요소를 중심으로 간결하게 정리해주세요.

                        본문:
                        {cleaned_text}
                        
                        요약:"""
                    }
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            summary = response.choices[0].message.content.strip()
            return summary
            
        except Exception as e:
            print(f"OpenAI 요약 중 오류 발생: {e}")
            return f"요약 생성 중 오류가 발생했습니다: {str(e)}"
    
    def _preprocess_text(self, text: str) -> str:
        """
        텍스트 전처리를 수행합니다.
        
        Args:
            text (str): 전처리할 텍스트
            
        Returns:
            str: 전처리된 텍스트
        """
        # 불필요한 공백, 특수문자 정리
        cleaned_text = re.sub(r'\s+', ' ', text).strip()
        return cleaned_text

# 싱글톤 인스턴스 생성
_openai_client_instance: Optional[OpenAIClient] = None

def get_openai_client() -> OpenAIClient:
    """
    OpenAI 클라이언트 싱글톤 인스턴스를 반환합니다.
    
    Returns:
        OpenAIClient: OpenAI 클라이언트 인스턴스
    """
    global _openai_client_instance
    if _openai_client_instance is None:
        _openai_client_instance = OpenAIClient()
    return _openai_client_instance

def summarize_ir_report_content(text: str) -> str:
    """
    IR 리포트 내용을 요약합니다.
    
    Args:
        text (str): 요약할 IR 리포트 텍스트
        
    Returns:
        str: 요약된 내용
    """
    client = get_openai_client()
    return client.summarize_text(text, max_tokens=200, temperature=0.3) 