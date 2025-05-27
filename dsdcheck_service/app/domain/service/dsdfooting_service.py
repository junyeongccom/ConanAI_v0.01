import pandas as pd
from typing import List, Dict, Any, Tuple
from ..model.dsdfooting_schema import FootingResultItem, FootingSheetResult, FootingResponse
from ..model.validation_rules import VALIDATION_RULES
import logging
from io import BytesIO

class DSDFootingService:
    """재무제표 합계검증 서비스"""
    
    # 시트 코드와 제목 매핑 (10개 시트)
    SHEET_TITLES = {
        "D210000": "재무상태표 - 연결",
        "D220000": "재무상태표 - 별도",
        "D310000": "손익계산서 - 연결",
        "D320000": "손익계산서 - 별도",
        "D410000": "포괄손익계산서 - 연결",
        "D420000": "포괄손익계산서 - 별도",
        "D510000": "현금흐름표 - 연결",
        "D520000": "현금흐름표 - 별도",
        "D610000": "자본변동표 - 연결",
        "D610005": "자본변동표 - 별도"
    }

    def _preprocess_dataframe(self, sheet_name: str, xls: pd.ExcelFile) -> pd.DataFrame:
        """
        엑셀 시트를 DataFrame으로 읽고 전처리
        
        Args:
            sheet_name (str): 시트명
            xls (pd.ExcelFile): 엑셀 파일 객체
            
        Returns:
            pd.DataFrame: 전처리된 DataFrame (항목명, 금액 컬럼 포함)
            
        Raises:
            ValueError: 유효한 컬럼을 찾을 수 없는 경우
        """
        try:
            # 헤더 없이 데이터 읽기
            df = pd.read_excel(xls, sheet_name, header=None)
            
            if len(df.columns) < 2:
                raise ValueError("Sheet must have at least 2 columns")
            
            # 첫 번째, 두 번째 열만 선택
            df = df.iloc[:, :2]
            df.columns = ['항목명', '금액']
            
            # 항목명 전처리
            df['항목명'] = df['항목명'].astype(str).str.strip()
            
            # 금액 컬럼 전처리
            df['금액'] = (df['금액']
                       .astype(str)
                       .str.replace(',', '')  # 쉼표 제거
                       .str.replace('−', '-')  # 전각 마이너스를 하이픈으로
                       .str.replace('(', '-')  # 괄호로 표시된 음수 처리
                       .str.replace(')', '')
                       .str.strip())
            
            # 숫자로 변환 (빈 문자열은 NaN으로)
            df['금액'] = pd.to_numeric(df['금액'], errors='coerce')
            
            # 유효한 행만 필터링
            # - 항목명이 비어있지 않고
            # - 금액이 숫자인 행만 선택
            df = df[
                df['항목명'].str.len() > 0 & 
                df['금액'].notna()
            ].copy()
            
            if len(df) == 0:
                raise ValueError("No valid data found after preprocessing")
            
            # 전처리 결과 로깅
            logging.info(
                f"\n📑 Sheet [{sheet_name}] Preprocessing Result:\n"
                f"✅ Total rows: {len(df)}\n"
                f"📋 Sample items (first 5):\n{df['항목명'].head().tolist()}\n"
                f"💰 Sample amounts (first 5):\n{df['금액'].head().apply(lambda x: f'{x:,.0f}').tolist()}"
            )
            
            return df
            
        except Exception as e:
            logging.warning(
                f"\n⚠️ Failed to preprocess sheet [{sheet_name}]:\n"
                f"❌ Error: {str(e)}\n"
                f"📊 Available columns: {df.columns.tolist() if 'df' in locals() else 'N/A'}"
            )
            raise ValueError(f"Failed to preprocess sheet {sheet_name}: {str(e)}")

    def check_footing(self, excel_file: bytes) -> FootingResponse:
        """엑셀 파일 합계검증 수행"""
        try:
            # BytesIO로 엑셀 파일 래핑
            with pd.ExcelFile(BytesIO(excel_file)) as xls:
                results = []
                mismatch_count = 0
                processed_sheets = 0
                
                # 각 시트별로 검증
                for sheet_name in xls.sheet_names:
                    if sheet_name in self.SHEET_TITLES:
                        try:
                            # 데이터프레임 전처리
                            df = self._preprocess_dataframe(sheet_name, xls)
                            
                            # 검증 수행
                            sheet_result = self._validate_sheet(sheet_name, df)
                            results.append(sheet_result)
                            
                            # 불일치 항목 카운트
                            mismatch_count += sum(1 for r in sheet_result.results if not r.is_match)
                            processed_sheets += 1
                            
                        except ValueError as e:
                            logging.error(f"❌ Failed to process sheet {sheet_name}: {str(e)}")
                            continue
                        except Exception as e:
                            logging.error(f"❌ Unexpected error processing sheet {sheet_name}: {str(e)}")
                            continue
                
                if processed_sheets == 0:
                    raise ValueError("No sheets were successfully processed")
                
                if len(results) == 0:
                    raise ValueError("No validation results were generated")
                
                logging.info(f"✅ Successfully processed {processed_sheets} out of {len(self.SHEET_TITLES)} sheets")
                
                return FootingResponse(
                    results=results,
                    total_sheets=len(results),
                    mismatch_count=mismatch_count
                )
            
        except Exception as e:
            logging.error(f"❌ Failed to process excel file: {str(e)}")
            raise ValueError(f"Invalid excel file format: {str(e)}")

    def _validate_sheet(self, sheet_code: str, df: pd.DataFrame) -> FootingSheetResult:
        """개별 시트 검증"""
        title = self.SHEET_TITLES[sheet_code]
        sheet_type = next((type_name for type_name in VALIDATION_RULES.keys() 
                         if type_name in title), None)
        
        if not sheet_type:
            logging.warning(f"❌ No validation rules found for sheet: {title}")
            return FootingSheetResult(sheet=sheet_code, title=title, results=[])
            
        rules = VALIDATION_RULES[sheet_type]
        results = []
        
        # 항목명 매칭 검사
        df_items = set(df['항목명'].unique())
        rule_items = {item for item, _ in rules.items() if item != "__special_checks__"}
        
        # 누락된 항목 확인
        missing_items = rule_items - df_items
        if missing_items:
            logging.warning(
                f"\n❌ Missing items in sheet [{sheet_code}]:\n"
                f"Expected but not found: {sorted(missing_items)}\n"
                f"💡 Available items: {sorted(df_items)}"
            )
            
            # Fuzzy matching 힌트 제공
            for missing in missing_items:
                # 간단한 문자열 유사도 계산 (공백/특수문자 제거 후 비교)
                normalized_missing = ''.join(c for c in missing if c.isalnum())
                matches = []
                for available in df_items:
                    normalized_available = ''.join(c for c in available if c.isalnum())
                    # 정규화된 문자열이 서로 포함 관계인 경우 힌트로 추가
                    if (normalized_missing in normalized_available or 
                        normalized_available in normalized_missing):
                        matches.append(available)
                if matches:
                    logging.info(f"💡 Possible matches for '{missing}': {matches}")
        
        # 특수 검증 규칙 처리
        if "__special_checks__" in rules:
            special_results = self._check_special_rules(df, rules["__special_checks__"])
            results.extend(special_results)
        
        # 최상위 항목부터 검증 시작
        for parent, children in rules.items():
            if parent != "__special_checks__" and not any(parent in child_list for child_list in rules.values() if isinstance(child_list, list)):
                result = self._check_sum(df, parent, children, rules)
                results.append(result)
        
        return FootingSheetResult(
            sheet=sheet_code,
            title=title,
            results=results
        )

    def _check_special_rules(self, df: pd.DataFrame, special_rules: Dict) -> List[FootingResultItem]:
        """특수 검증 규칙 처리"""
        results = []
        
        for rule_name, rule in special_rules.items():
            try:
                # 첫 번째 항목 값 가져오기
                item1_row = df[df['항목명'] == rule['항목1']]
                if item1_row.empty:
                    logging.warning(f"Item1 not found for special rule {rule_name}: {rule['항목1']}")
                    continue
                item1_value = float(item1_row['금액'].iloc[0])
                
                # 두 번째 항목(들) 값 계산
                item2_sum = 0
                child_results = []
                
                for item2 in rule['항목2']:
                    item2_row = df[df['항목명'] == item2]
                    if item2_row.empty:
                        logging.warning(f"Item2 not found for special rule {rule_name}: {item2}")
                        continue
                    item2_value = float(item2_row['금액'].iloc[0])
                    item2_sum += item2_value
                    
                    child_results.append(FootingResultItem(
                        item=item2,
                        expected=None,
                        actual=item2_value,
                        is_match=True,
                        children=[]
                    ))
                
                # 값 비교 (반올림 오차 허용)
                is_match = abs(item1_value - item2_sum) < 0.01
                
                if not is_match:
                    logging.warning(
                        f"Special rule mismatch in {rule_name}: "
                        f"item1={item1_value:,.0f}, "
                        f"item2_sum={item2_sum:,.0f}, "
                        f"diff={item1_value-item2_sum:,.0f}"
                    )
                
                results.append(FootingResultItem(
                    item=f"{rule_name} ({rule['항목1']} {rule['연산자']} {'+'.join(rule['항목2'])})",
                    expected=item2_sum,
                    actual=item1_value,
                    is_match=is_match,
                    children=child_results
                ))
                
            except Exception as e:
                logging.error(f"Error checking special rule {rule_name}: {str(e)}")
                results.append(FootingResultItem(
                    item=rule_name,
                    is_match=False,
                    children=[]
                ))
        
        return results

    def _check_sum(self, df: pd.DataFrame, parent: str, children: List[str], rules: Dict) -> FootingResultItem:
        """항목별 합계 검증 (재귀적)"""
        try:
            # 부모 항목 값 찾기
            parent_row = df[df['항목명'] == parent]
            if parent_row.empty:
                logging.warning(f"Parent item not found: {parent}")
                return FootingResultItem(
                    item=parent,
                    is_match=False,
                    children=[]
                )
                
            parent_value = float(parent_row['금액'].iloc[0])
            
            # 자식 항목들의 합 계산
            child_results = []
            child_sum = 0
            
            for child in children:
                multiplier = -1 if child.startswith('-') else 1
                child_name = child.lstrip('-')
                
                try:
                    child_row = df[df['항목명'] == child_name]
                    if child_row.empty:
                        logging.warning(f"Child item not found: {child_name} (parent: {parent})")
                        child_results.append(FootingResultItem(
                            item=child_name,
                            is_match=False,
                            children=[]
                        ))
                        continue
                        
                    child_value = float(child_row['금액'].iloc[0]) * multiplier
                    child_sum += child_value
                    
                    # 자식 항목이 부모인 경우 재귀적으로 검증
                    if child_name in rules and isinstance(rules[child_name], list):
                        child_result = self._check_sum(df, child_name, rules[child_name], rules)
                    else:
                        child_result = FootingResultItem(
                            item=child_name,
                            expected=None,
                            actual=child_value,
                            is_match=True,
                            children=[]
                        )
                        
                    child_results.append(child_result)
                    
                except (IndexError, ValueError) as e:
                    logging.error(f"Error processing child {child_name}: {str(e)}")
                    child_results.append(FootingResultItem(
                        item=child_name,
                        is_match=False,
                        children=[]
                    ))
            
            # 합계 비교 (반올림 오차 허용)
            is_match = abs(parent_value - child_sum) < 0.01
            
            if not is_match:
                logging.warning(
                    f"Mismatch in {parent}: "
                    f"expected={child_sum:,.0f}, "
                    f"actual={parent_value:,.0f}, "
                    f"diff={parent_value-child_sum:,.0f}"
                )
            
            return FootingResultItem(
                item=parent,
                expected=child_sum,
                actual=parent_value,
                is_match=is_match,
                children=child_results
            )
            
        except Exception as e:
            logging.error(f"Error checking sum for {parent}: {str(e)}")
            return FootingResultItem(
                item=parent,
                is_match=False,
                children=[]
            )
