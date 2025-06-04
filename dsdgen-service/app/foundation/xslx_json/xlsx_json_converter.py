import os
import pandas as pd
import re
from datetime import datetime
from typing import Dict, List, Any, Optional, Union, Tuple
from pathlib import Path


class XlsxJsonConverter:
    """
    엑셀 파일(xlsx, xls)을 JSON 형식으로 변환하는 클래스
    """
    
    @staticmethod
    def convert_file(file_path: str, specific_sheets: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        엑셀 파일을 읽어 JSON 형식으로 변환
        
        Args:
            file_path: 엑셀 파일 경로
            specific_sheets: 특정 시트만 변환하고 싶을 경우 시트명 리스트 (None이면 모든 시트 변환)
            
        Returns:
            Dict: 시트별 JSON 데이터
        """
        if not os.path.exists(file_path):
            return {"error": f"File not found: {file_path}"}
        
        try:
            # 파일 확장자 확인
            if not (file_path.endswith('.xlsx') or file_path.endswith('.xls')):
                return {"error": "Unsupported file format. Only .xlsx and .xls files are supported."}
            
            # 엑셀 파일 로드
            excel_data = {}
            xls = pd.ExcelFile(file_path)
            
            # 변환할 시트 결정
            sheets_to_convert = specific_sheets if specific_sheets else xls.sheet_names
            
            # 각 시트 처리
            for sheet_name in sheets_to_convert:
                if sheet_name in xls.sheet_names:
                    excel_data[sheet_name] = XlsxJsonConverter._process_sheet_with_date_columns(xls, sheet_name)
                else:
                    excel_data[f"error_{sheet_name}"] = f"Sheet '{sheet_name}' not found in the Excel file"
            
            file_name = Path(file_path).name
            
            return {
                "filename": file_name,
                "sheets": excel_data,
                "message": "Excel file successfully converted to JSON"
            }
            
        except Exception as e:
            return {"error": f"Error converting Excel to JSON: {str(e)}"}
    
    @staticmethod
    def _process_sheet_with_date_columns(xls: pd.ExcelFile, sheet_name: str) -> List[Dict[str, Any]]:
        """
        개별 시트를 처리하여 JSON 형식으로 변환
        날짜 행을 찾아 컬럼명으로 변경하고, 'Index'를 '계정과목'으로 변경하며, 불필요한 행을 제거
        
        Args:
            xls: pandas ExcelFile 객체
            sheet_name: 처리할 시트 이름
            
        Returns:
            List[Dict]: 시트 데이터를 JSON 형식으로 변환한 결과
        """
        # 첫 몇 줄 건너뛰는 경우를 대비해 여러 옵션 시도
        df = None
        skiprows_options = [0, 1, 2, 3, 4, 5]
        
        # 각 skiprows 옵션을 시도하여 가장 의미 있는 데이터가 있는 형태로 로드
        for skiprows in skiprows_options:
            try:
                temp_df = pd.read_excel(xls, sheet_name=sheet_name, skiprows=skiprows)
                
                # 빈 데이터프레임이면 다음 옵션으로
                if temp_df.empty:
                    continue
                
                # 열 이름이 모두 NaN이면 다음 옵션으로
                if temp_df.columns.isna().all():
                    continue
                
                # 데이터가 충분히 있으면 이 옵션 선택
                if not temp_df.iloc[:, 0].dropna().empty:
                    df = temp_df
                    break
            except:
                continue
        
        # 모든 옵션이 실패하면 기본 옵션으로 로드
        if df is None:
            df = pd.read_excel(xls, sheet_name=sheet_name)
        
        # NaN 값을 빈 문자열로 대체
        df = df.fillna("")
        
        # 불필요한 빈 행/열 제거
        df = XlsxJsonConverter._clean_dataframe(df)
        
        # 날짜 행을 찾아 컬럼명 변경 처리
        df, date_row_index = XlsxJsonConverter._process_date_columns(df)
        
        # 날짜 행이 있으면 해당 행은 제외
        if date_row_index is not None:
            df = df.drop(date_row_index)
        
        # 'Index' 컬럼명을 '계정과목'으로 변경
        # df 열 이름이 실제로 'Index'인 경우와 0번째 컬럼인 경우 모두 대비
        if 'Index' in df.columns:
            df = df.rename(columns={'Index': '계정과목'})
        elif df.columns[0] != '계정과목':
            new_columns = df.columns.tolist()
            new_columns[0] = '계정과목'
            df.columns = new_columns
        
        # 시트 데이터 전처리
        df = XlsxJsonConverter.clean_sheet_data(df, sheet_name)
        
        # 데이터프레임을 레코드 형식의 JSON으로 변환
        return df.to_dict(orient="records")
    
    @staticmethod
    def clean_sheet_data(df: pd.DataFrame, sheet_name: str) -> pd.DataFrame:
        """
        시트 데이터를 전처리하는 함수
        
        Args:
            df: 처리할 DataFrame
            sheet_name: 시트 이름
            
        Returns:
            pd.DataFrame: 전처리된 DataFrame
        """
        # 모든 셀이 비어있는 행 제거
        df = df.dropna(how='all')
        
        # 시트 이름이 포함된 행 제거
        # 모든 열을 문자열로 변환하여 검사
        for col in df.columns:
            df[col] = df[col].astype(str)
        
        # 시트 이름이 포함된 행 찾기
        mask = df.apply(lambda row: any(sheet_name in str(val) for val in row), axis=1)
        
        # 해당 행 제거
        df = df[~mask]
        
        return df
    
    @staticmethod
    def _process_date_columns(df: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[int]]:
        """
        날짜 행을 찾아 컬럼명을 날짜로 변경
        
        Args:
            df: 처리할 DataFrame
            
        Returns:
            Tuple[pd.DataFrame, Optional[int]]: 처리된 DataFrame과 날짜 행 인덱스
        """
        date_row_index = None
        
        # 날짜 패턴 정규식
        date_pattern = re.compile(r'(\d{4})[-./년]?\s*(\d{1,2})[-./월]?\s*(\d{1,2}일?)?')
        
        # 각 행을 탐색하여 날짜가 있는 행 찾기
        for idx, row in df.iterrows():
            # 첫 번째 열(계정과목)은 제외하고 날짜 검사
            date_values = []
            has_dates = False
            
            for i, value in enumerate(row[1:], 1):
                if isinstance(value, str) and date_pattern.search(value):
                    date_values.append((i, value))
                    has_dates = True
                elif isinstance(value, datetime):
                    date_values.append((i, value.strftime('%Y-%m-%d')))
                    has_dates = True
            
            if has_dates and len(date_values) >= 1:
                date_row_index = idx
                # 새 컬럼명 생성
                new_columns = df.columns.tolist()
                
                # 날짜 컬럼명 변경
                for col_idx, date_str in date_values:
                    # 날짜 값에서 날짜 추출
                    match = date_pattern.search(date_str)
                    if match:
                        year = match.group(1)
                        month = match.group(2).zfill(2)  # 월을 두 자리로 맞춤
                        day = match.group(3)
                        
                        if day:
                            # '일' 문자 제거하고 두 자리로 맞춤
                            day = day.replace('일', '').zfill(2)
                            date_column = f"{year}-{month}-{day}"
                        else:
                            # 일자가 없는 경우 월말로 설정
                            date_column = f"{year}-{month}-31"
                    else:
                        # 날짜 형식이 인식되지 않으면 원래 값 사용
                        date_column = date_str
                    
                    new_columns[col_idx] = date_column
                
                df.columns = new_columns
                break
        
        return df, date_row_index
    
    @staticmethod
    def _clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        """
        불필요한 빈 행/열을 제거하고 데이터프레임 정리
        
        Args:
            df: 정리할 pandas DataFrame
            
        Returns:
            pd.DataFrame: 정리된 DataFrame
        """
        # 모든 값이 빈 문자열이거나 NaN인 행 제거
        df = df.dropna(how='all')
        
        # 모든 값이 빈 문자열이거나 NaN인 열 제거
        df = df.dropna(axis=1, how='all')
        
        # 열 이름이 NaN인 경우 col_0, col_1 형식으로 변경
        df.columns = [f"col_{i}" if pd.isna(col) else col for i, col in enumerate(df.columns)]
        
        return df
    
    @staticmethod
    def extract_tables_from_sheet(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        데이터프레임에서 테이블 형태의 데이터를 추출
        
        Args:
            df: pandas DataFrame
            
        Returns:
            List[Dict]: 추출된 테이블 데이터
        """
        # 여기서는 전체 데이터프레임을 하나의 테이블로 간주하고 반환
        # 실제로는 더 복잡한 로직이 필요할 수 있음 (예: 여러 테이블 구분)
        cleaned_df = XlsxJsonConverter._clean_dataframe(df)
        return cleaned_df.to_dict(orient="records") 