import re
import os
from pathlib import Path
from typing import Tuple, Dict, List, Optional, Any, Union
from bs4 import BeautifulSoup
import pandas as pd


class XBRLParser:
    """
    XBRL 파일을 파싱하고 분석하는 클래스입니다.
    
    이 클래스는 다음과 같은 기능을 제공합니다:
    1. 파일 시스템에서 XBRL 파일을 찾고
    2. BeautifulSoup를 사용하여 XBRL 파일을 파싱하고
    3. 파싱된 데이터를 분석하여 DataFrame으로 변환
    """

    def __init__(self, base_dir: Union[str, Path] = "/app/app/dart_documents/extracted"):
        """
        XBRLParser 객체 초기화
        
        Args:
            base_dir: XBRL 파일이 저장된 기본 디렉토리 경로
        """
        self.extracted_dir = Path(base_dir)
        # 디렉토리가 없으면 생성
        os.makedirs(self.extracted_dir, exist_ok=True)
        print(f"[INFO] XBRL 파일 경로 기본 디렉토리: {self.extracted_dir}")

    async def find_xbrl_files(self, corp_code: str) -> Tuple[Optional[Path], Optional[Path], Optional[BeautifulSoup], Optional[BeautifulSoup]]:
        """
        기업 고유번호로 디렉토리를 찾고, .xbrl 파일과 lab-ko.xml 파일을 함께 찾아 파싱합니다.
        
        Args:
            corp_code: 기업 고유번호
            
        Returns:
            tuple: (xbrl_path, label_path, xbrl_soup, label_soup)
            
        Raises:
            FileNotFoundError: 디렉토리나 XBRL 파일을 찾을 수 없는 경우
            ValueError: XBRL 파일 파싱에 실패한 경우
        """
        # 기업 고유번호로 디렉토리 찾기
        corp_dir = None
        
        try:
            available_dirs = [d for d in os.listdir(self.extracted_dir) 
                            if os.path.isdir(self.extracted_dir / d)]
            
            print(f"[INFO] 사용 가능한 디렉토리: {available_dirs}")
            
            # 기업 고유번호로 시작하는 디렉토리 찾기
            for dir_name in available_dirs:
                if dir_name.startswith(corp_code):
                    corp_dir = self.extracted_dir / dir_name
                    print(f"[INFO] 기업 고유번호 {corp_code}로 시작하는 디렉토리를 찾았습니다: {dir_name}")
                    break
            
            # 정확한 디렉토리를 찾지 못한 경우
            if corp_dir is None:
                # 유사한 디렉토리 찾기 시도
                for dir_name in available_dirs:
                    if corp_code in dir_name:
                        corp_dir = self.extracted_dir / dir_name
                        print(f"[INFO] 기업 고유번호 {corp_code}가 포함된 디렉토리를 찾았습니다: {dir_name}")
                        break
                
                # 그래도 찾지 못한 경우 가장 최근 디렉토리 사용
                if corp_dir is None and available_dirs:
                    dir_name = available_dirs[-1]
                    corp_dir = self.extracted_dir / dir_name
                    print(f"[INFO] 기업 고유번호에 맞는 디렉토리를 찾지 못해 가장 최근 디렉토리를 사용합니다: {dir_name}")
            
            # 디렉토리를 찾지 못한 경우
            if corp_dir is None:
                raise FileNotFoundError(f"추출된 디렉토리가 비어 있거나 기업 고유번호에 해당하는 디렉토리를 찾을 수 없습니다: {self.extracted_dir}")
            
            # 디렉토리 내의 모든 파일 목록 가져오기
            available_files = os.listdir(corp_dir)
            print(f"[INFO] 디렉토리 {corp_dir.name}에 있는 파일: {len(available_files)}개")
            
            # .xbrl 파일 찾기
            xbrl_files = [f for f in available_files if f.endswith('.xbrl')]
            if not xbrl_files:
                raise FileNotFoundError(f"XBRL 파일을 찾을 수 없습니다: {corp_dir}")
            
            # lab-ko.xml 파일 찾기
            label_files = [f for f in available_files if 'lab-ko.xml' in f]
            if not label_files:
                print(f"[WARN] lab-ko.xml 파일을 찾을 수 없습니다: {corp_dir}")
                label_path = None
                label_soup = None
            else:
                label_path = corp_dir / label_files[0]
                print(f"[INFO] 라벨 파일을 찾았습니다: {label_path}")
                try:
                    with open(label_path, "r", encoding="utf-8") as file:
                        label_content = file.read()
                    label_soup = BeautifulSoup(label_content, 'xml')
                    print(f"[INFO] 라벨 파일 파싱 성공")
                except Exception as e:
                    print(f"[ERROR] 라벨 파일 파싱 실패: {e}")
                    label_soup = None
                    label_path = None
            
            # .xbrl 파일 파싱
            xbrl_path = corp_dir / xbrl_files[0]
            print(f"[INFO] XBRL 파일을 찾았습니다: {xbrl_path}")
            
            try:
                with open(xbrl_path, "r", encoding="utf-8") as file:
                    xbrl_content = file.read()
                
                # BeautifulSoup으로 XML 파싱
                try:
                    xbrl_soup = BeautifulSoup(xbrl_content, 'xml')
                    parser = 'xml'
                except:
                    print("[WARN] XML 파서로 파싱 실패, lxml로 재시도합니다.")
                    xbrl_soup = BeautifulSoup(xbrl_content, 'lxml')
                    parser = 'lxml'
                
                print(f"[INFO] XBRL 파일을 {parser} 파서로 파싱했습니다.")
            except Exception as e:
                raise ValueError(f"XBRL 파일 파싱 실패: {e}")
            
            return xbrl_path, label_path, xbrl_soup, label_soup
            
        except Exception as e:
            print(f"[ERROR] XBRL 파일 검색 및 파싱 실패: {e}")
            raise

    def get_label_ko_mapping(self, label_soup: Optional[BeautifulSoup]) -> Dict[str, str]:
        """
        lab-ko.xml 파일에서 태그명과 한글 라벨 간의 매핑을 추출합니다.
        
        Args:
            label_soup: 파싱된 라벨 파일의 BeautifulSoup 객체
            
        Returns:
            dict: 태그명을 키로, 한글 라벨을 값으로 하는 딕셔너리
        """
        if label_soup is None:
            print("[WARN] 라벨 파일이 없어 한글 라벨 매핑을 생성할 수 없습니다.")
            return {}
        
        try:
            # 태그명 → 한글 라벨 매핑
            label_mapping = {}
            
            # labelLink 요소 찾기
            label_links = label_soup.find_all('labelLink')
            if not label_links:
                print("[WARN] labelLink 요소를 찾을 수 없습니다.")
                return {}
            
            # loc 요소와 label 요소 처리
            for label_link in label_links:
                # loc 요소에서 xlink:href와 xlink:label 추출
                loc_elements = label_link.find_all('loc')
                loc_dict = {}
                
                for loc in loc_elements:
                    href = loc.get('xlink:href', '')
                    label = loc.get('xlink:label', '')
                    
                    # href에서 태그 이름 추출 (예: #ifrs-full_CurrentAssets)
                    if href.startswith('#'):
                        tag_name = href[1:]  # '#' 제거
                        loc_dict[label] = tag_name
                
                # label 요소에서 xlink:label과 텍스트 추출
                label_elements = label_link.find_all('label')
                
                for label_elem in label_elements:
                    label_ref = label_elem.get('xlink:label', '')
                    lang = label_elem.get('xml:lang', '')
                    role = label_elem.get('xlink:role', '')
                    
                    # 한국어 라벨만 추출 (표준 라벨 역할 고려)
                    if lang == 'ko' and ('label' in role or 'standard' in role.lower()):
                        label_text = label_elem.text.strip()
                        
                        # labelArc 요소를 통해 loc와 label 연결
                        label_arcs = label_link.find_all('labelArc', {'xlink:to': label_ref})
                        
                        for arc in label_arcs:
                            from_ref = arc.get('xlink:from', '')
                            if from_ref in loc_dict:
                                tag_name = loc_dict[from_ref]
                                
                                # 네임스페이스 처리 (ifrs-full_CurrentAssets → CurrentAssets)
                                if '_' in tag_name:
                                    _, tag_name = tag_name.split('_', 1)
                                
                                label_mapping[tag_name] = label_text
            
            print(f"[INFO] 한글 라벨 매핑 {len(label_mapping)}개 생성됨")
            return label_mapping
            
        except Exception as e:
            print(f"[ERROR] 한글 라벨 매핑 추출 실패: {e}")
            return {}

    def get_xbrl_tags(self, xbrl_soup: BeautifulSoup) -> List[Dict[str, str]]:
        """
        XBRL 파일에서 관련 태그를 추출합니다.
        
        Args:
            xbrl_soup: 파싱된 XBRL 파일의 BeautifulSoup 객체
            
        Returns:
            list[dict]: 추출된 태그 정보 목록 (항목명, 값, contextRef, 단위, 소수점 포함)
        """
        # 추출하려는 특정 태그 이름 목록 (네임스페이스 포함)
        allowed_tags = [
            "ifrs-full:CurrentAssets",
            "ifrs-full:CashAndCashEquivalents",
            "ifrs-full:ShorttermDepositsNotClassifiedAsCashEquivalents",
            "ifrs-full:CurrentTradeReceivables",
            "dart:ShortTermOtherReceivablesNet",
            "ifrs-full:CurrentPrepaidExpenses",
            "ifrs-full:Inventories",
            "ifrs-full:OtherCurrentAssets",
            "ifrs-full:NoncurrentAssets",
            "ifrs-full:NoncurrentFinancialAssetsMeasuredAtFairValueThroughOtherComprehensiveIncome",
            "ifrs-full:NoncurrentFinancialAssetsAtFairValueThroughProfitOrLoss",
            "ifrs-full:InvestmentsInSubsidiariesJointVenturesAndAssociates",
            "ifrs-full:NoncurrentRecognisedAssetsDefinedBenefitPlan",
            "ifrs-full:DeferredTaxAssets",
            "ifrs-full:OtherNoncurrentAssets",
            "ifrs-full:Assets",
            "ifrs-full:CurrentLiabilities",
            "ifrs-full:TradeAndOtherCurrentPayablesToTradeSuppliers",
            "ifrs-full:OtherCurrentPayables",
            "ifrs-full:CurrentAdvances",
            "dart:ShortTermWithholdings",
            "ifrs-full:AccrualsClassifiedAsCurrent",
            "ifrs-full:CurrentTaxLiabilities",
            "ifrs-full:CurrentPortionOfLongtermBorrowings",
            "ifrs-full:CurrentProvisions",
            "ifrs-full:OtherCurrentLiabilities",
            "ifrs-full:NoncurrentLiabilities",
            "ifrs-full:NoncurrentPortionOfNoncurrentBondsIssued",
            "ifrs-full:NoncurrentPortionOfNoncurrentLoansReceived",
            "ifrs-full:OtherNoncurrentPayables",
            "ifrs-full:NoncurrentProvisions",
            "ifrs-full:OtherNoncurrentLiabilities",
            "ifrs-full:Liabilities",
            "ifrs-full:IssuedCapital",
            "dart:IssuedCapitalOfPreferredStock",
            "dart:IssuedCapitalOfCommonStock",
            "ifrs-full:SharePremium",
            "ifrs-full:RetainedEarnings",
            "dart:ElementsOfOtherStockholdersEquity",
            "ifrs-full:EquityAndLiabilities"
        ]
        
        try:
            print(f"[INFO] 추출할 태그 목록: {len(allowed_tags)} 개")
            
            # 태그 이름을 정확히 매칭하여 추출
            extracted_tags = []
            processed_count = 0
            filtered_count = 0
            
            for tag_name in allowed_tags:
                # 해당 태그 이름을 가진 모든 요소 찾기
                matching_tags = xbrl_soup.find_all(tag_name)
                
                if matching_tags:
                    for tag in matching_tags:
                        # 네임스페이스(콜론) 처리
                        if ':' in tag.name:
                            namespace, local_name = tag.name.split(':', 1)
                        else:
                            local_name = tag.name
                        
                        # 값 (텍스트 내용)
                        value = tag.text.strip() if tag.text else ""
                        
                        # contextRef 속성
                        context_ref = tag.get('contextRef', '')
                        
                        # 별도재무제표(SeparateMember)가 포함된 항목만 필터링
                        if 'SeparateMember' not in context_ref:
                            continue
                        
                        # 단위 (unitRef 속성)
                        unit_ref = tag.get('unitRef', '')
                        
                        # 수치 정보에 포함된 소수점 정보 (decimals 속성)
                        decimals = tag.get('decimals', '')
                        
                        # 데이터가 모두 있는 경우만 추가
                        if value and context_ref:
                            extracted_tags.append({
                                "항목명": local_name,
                                "값": value,
                                "contextRef": context_ref,
                                "단위": unit_ref,
                                "소수점": decimals
                            })
                            processed_count += 1
                            filtered_count += 1
            
            print(f"[INFO] 추출된 총 항목 수: {processed_count}")
            print(f"[INFO] 별도재무제표(SeparateMember) 항목 수: {filtered_count}")
            return extracted_tags
            
        except Exception as e:
            print(f"[ERROR] XBRL 태그 추출 실패: {e}")
            return []
    
    def extract_year_from_context(self, context_ref: str) -> str:
        """
        contextRef에서 회계연도를 추출합니다.
        
        Args:
            context_ref: contextRef 값 (예: "PFY2023eFY_ifrs-full_ConsolidatedAndSeparateFinancialStatementsAxis_ifrs-full_SeparateMember")
            
        Returns:
            str: 추출된 회계연도 (예: "2023")
        """
        try:
            # 회계연도 패턴 정규식
            year_patterns = [
                r'FY(\d{4})',         # FY2023
                r'PFY(\d{4})',        # PFY2023
                r'BPFY(\d{4})',       # BPFY2023
                r'CFY(\d{4})',        # CFY2023
                r'(\d{4})(?:Q[1-4])?'  # 2023 또는 2023Q1, 2023Q2 등
            ]
            
            for pattern in year_patterns:
                match = re.search(pattern, context_ref)
                if match:
                    return match.group(1)
            
            # 일치하는 패턴이 없는 경우
            print(f"[WARN] contextRef에서 회계연도를 추출할 수 없습니다: {context_ref}")
            return "N/A"
            
        except Exception as e:
            print(f"[ERROR] 회계연도 추출 실패: {e}")
            return "N/A"
    
    def decimals_to_unit_label(self, decimals: str, unit: str) -> str:
        """
        decimals 값에 따라 적절한 단위 라벨을 반환합니다.
        
        Args:
            decimals: 소수점 정보 (예: "-6")
            unit: 원본 단위 (예: "KRW")
            
        Returns:
            str: 변환된 단위 라벨 (예: "백만원 KRW")
        """
        try:
            if not decimals or not unit:
                return f"원 {unit}" if unit else "원"
                
            decimal_value = int(decimals)
            
            # 소수점 정보에 따른 단위 변환
            if decimal_value == -3:
                return f"천원 {unit}"
            elif decimal_value == -4:
                return f"만원 {unit}"
            elif decimal_value == -6:
                return f"백만원 {unit}"
            elif decimal_value == -8:
                return f"억원 {unit}"
            else:
                return f"원 {unit}"
                
        except ValueError:
            # 소수점 정보가 정수로 변환될 수 없는 경우
            print(f"[WARN] 소수점 정보를 해석할 수 없습니다: {decimals}")
            return f"원 {unit}" if unit else "원"
    
    def format_number_with_decimals(self, value: str, decimals: str) -> str:
        """
        값과 소수점 정보를 기반으로 천단위 쉼표가 포함된 문자열로 변환합니다.
        
        Args:
            value: 원본 숫자 문자열 (예: "68548442000000")
            decimals: 소수점 정보 (예: "-6")
            
        Returns:
            str: 변환된 숫자 문자열 (예: "68,548,442")
        """
        try:
            # 문자열을 숫자로 변환
            num_value = float(value)
            
            # decimals 값이 있는 경우 처리
            if decimals:
                try:
                    decimal_value = int(decimals)
                    
                    # 음수일 경우 (예: "-6"은 백만 단위)
                    if decimal_value < 0:
                        divider = 10 ** abs(decimal_value)
                        num_value = num_value / divider
                    # 양수일 경우 (소수점 자릿수)
                    else:
                        # 소수점 자릿수만큼 표시
                        return f"{num_value:,.{decimal_value}f}"
                except ValueError:
                    print(f"[WARN] 소수점 정보를 처리할 수 없습니다: {decimals}")
            
            # 천단위 쉼표가 포함된 문자열로 변환 (소수점 없음)
            return f"{int(num_value):,}"
        except ValueError:
            print(f"[WARN] 숫자 값으로 변환할 수 없습니다: {value}")
            return "0"
        
    async def extract_xbrl_to_dataframe(self, corp_code: str) -> pd.DataFrame:
        """
        기업 고유번호로 디렉토리를 찾아 XBRL 파일과 lab-ko.xml 파일을 파싱하고,
        XBRL 데이터를 추출하여 정제된 DataFrame으로 변환합니다.
        
        Args:
            corp_code: 기업 고유번호 (예: 20250331002860_11011)
            
        Returns:
            pandas.DataFrame: XBRL 데이터 기업코드, 항목명, 값, 연도, 단위 정보
            
        Raises:
            FileNotFoundError: 디렉토리나 XBRL 파일을 찾을 수 없는 경우
            ValueError: XBRL 파일 파싱에 실패한 경우
        """
        try:
            # XBRL 파일과 라벨 파일 찾아서 파싱
            _, _, xbrl_soup, label_soup = await self.find_xbrl_files(corp_code)
            
            # 태그 정보 추출
            extracted_tags = self.get_xbrl_tags(xbrl_soup)
            
            if not extracted_tags:
                print("[WARN] 추출된 태그가 없습니다.")
                return pd.DataFrame()
            
            # 태그명 → 한글 라벨 매핑 가져오기
            label_mapping = self.get_label_ko_mapping(label_soup)
            
            # 정제된 데이터 준비
            refined_data = []
            
            for tag in extracted_tags:
                # 태그명에 해당하는 한글 라벨 찾기
                item_name = tag["항목명"]
                ko_label = label_mapping.get(item_name, item_name)  # 매핑이 없으면 원본 사용
                
                # 값 변환 (소수점 정보 적용, 천단위 쉼표 포함)
                raw_value = tag["값"]
                decimals = tag["소수점"]
                formatted_value = self.format_number_with_decimals(raw_value, decimals)
                
                # 연도 추출
                context_ref = tag["contextRef"]
                year = self.extract_year_from_context(context_ref)
                
                # 단위 변환 (decimals 값에 따라)
                unit_ref = tag["단위"]
                formatted_unit = self.decimals_to_unit_label(decimals, unit_ref)
                
                # 정제된 데이터 추가 (기업코드 추가 및 항목명(한글) -> 항목명으로 변경)
                refined_data.append({
                    "기업코드": corp_code,
                    "항목명": ko_label,
                    "값": formatted_value,
                    "연도": year,
                    "단위": formatted_unit
                })
            
            # 정제된 정보로 DataFrame 생성
            df = pd.DataFrame(refined_data)
            
            # 결과 정보 출력
            print(f"[INFO] 정제된 DataFrame 열: {df.columns.tolist()}")
            print("\n===== 추출된 XBRL 데이터 =====")
            # 최대 10개 항목만 출력
            max_rows = min(10, len(df))
            if not df.empty:
                print(df.head(max_rows))
            else:
                print("추출된 데이터가 없습니다.")
            print("==================================\n")
            
            return df
            
        except Exception as e:
            print(f"[ERROR] XBRL 데이터프레임 추출 실패: {e}")
            return pd.DataFrame() 