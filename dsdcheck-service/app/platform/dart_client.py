import os
import requests
import xml.etree.ElementTree as ET
from typing import Optional, List
import logging

from app.domain.model.dsdcheck_schema import DartFinancialApiResponse, DartFinancialApiItem

logger = logging.getLogger(__name__)


class DartClient:
    """DART 공시시스템 클라이언트"""
    
    def __init__(self):
        self.dart_api_key = os.getenv("DART_API_KEY")
        self.base_url = "https://opendart.fss.or.kr"
        self.corpcode_xml_path = "app/resources/CORPCODE.xml"
        
        if not self.dart_api_key:
            raise ValueError("DART_API_KEY가 환경변수에 설정되지 않았습니다.")
    
    def get_corp_code_local(self, corp_name: str) -> Optional[str]:
        """
        로컬 CORPCODE.xml 파일에서 기업명으로 기업코드를 조회
        
        Args:
            corp_name: 기업명 (예: "LG화학")
            
        Returns:
            기업코드 또는 None
        """
        try:
            if not os.path.exists(self.corpcode_xml_path):
                logger.error(f"CORPCODE.xml 파일이 존재하지 않습니다: {self.corpcode_xml_path}")
                return None
            
            tree = ET.parse(self.corpcode_xml_path)
            root = tree.getroot()
            
            for corp in root.findall('list'):
                corp_name_elem = corp.find('corp_name')
                corp_code_elem = corp.find('corp_code')
                
                if corp_name_elem is not None and corp_code_elem is not None:
                    if corp_name_elem.text and corp_name_elem.text.strip() == corp_name.strip():
                        logger.info(f"기업코드 조회 성공: {corp_name} -> {corp_code_elem.text}")
                        return corp_code_elem.text
            
            logger.warning(f"기업명을 찾을 수 없습니다: {corp_name}")
            return None
            
        except ET.ParseError as e:
            logger.error(f"XML 파싱 오류: {e}")
            return None
        except Exception as e:
            logger.error(f"기업코드 조회 중 오류 발생: {e}")
            return None
    
    def get_financial_statements(self, corp_code: str, year: int, fs_div: str) -> Optional[List[DartFinancialApiItem]]:
        """
        DART API를 통해 재무제표 데이터를 조회
        
        Args:
            corp_code: 기업코드
            year: 사업연도
            fs_div: 재무제표 구분 (CFS: 연결, OFS: 별도)
            
        Returns:
            재무제표 항목 리스트 또는 None
        """
        try:
            url = f"{self.base_url}/api/fnlttSinglAcntAll.json"
            params = {
                "crtfc_key": self.dart_api_key,
                "corp_code": corp_code,
                "bsns_year": str(year),
                "reprt_code": "11011",  # 사업보고서
                "fs_div": fs_div
            }
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") != "000":
                logger.error(f"DART API 오류: {data.get('message', 'Unknown error')}")
                return None
            
            dart_response = DartFinancialApiResponse(**data)
            
            if not dart_response.list:
                logger.warning(f"재무제표 데이터를 찾을 수 없습니다. 기업코드: {corp_code}, 연도: {year}, 구분: {fs_div}")
                return None
            
            logger.info(f"재무제표 조회 성공: {corp_code}, {year}, {fs_div} - {len(dart_response.list)}개 항목")
            return dart_response.list
            
        except requests.RequestException as e:
            logger.error(f"DART API 요청 오류: {e}")
            return None
        except Exception as e:
            logger.error(f"재무제표 조회 중 오류 발생: {e}")
            return None
    
    def get_all_financial_statements(self, corp_code: str, year: int) -> dict:
        """
        연결(CFS)과 별도(OFS) 재무제표를 모두 조회
        
        Args:
            corp_code: 기업코드
            year: 사업연도
            
        Returns:
            {"CFS": [...], "OFS": [...]} 형태의 딕셔너리
        """
        result = {}
        
        # 연결재무제표 조회
        cfs_data = self.get_financial_statements(corp_code, year, "CFS")
        if cfs_data:
            result["CFS"] = cfs_data
        else:
            logger.warning(f"연결재무제표 조회 실패: {corp_code}, {year}")
            result["CFS"] = []
        
        # 별도재무제표 조회
        ofs_data = self.get_financial_statements(corp_code, year, "OFS")
        if ofs_data:
            result["OFS"] = ofs_data
        else:
            logger.warning(f"별도재무제표 조회 실패: {corp_code}, {year}")
            result["OFS"] = []
        
        return result
