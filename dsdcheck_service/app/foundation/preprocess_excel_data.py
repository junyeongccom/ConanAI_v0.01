import pandas as pd
import re
from typing import List, Dict, Optional, Tuple
import logging
from fastapi import UploadFile
from io import BytesIO
from datetime import datetime
import openpyxl

from app.domain.model.dsdcheck_schema import (
    FinancialStatementFromExcel,
    FinancialStatementItem,
    SheetMapping
)

logger = logging.getLogger(__name__)


def parse_index_row(cell_value: str) -> Optional[Tuple[str, str, str]]:
    """
    Index 시트의 셀 값을 파싱하여 시트 ID, fs_div, sj_div를 추출
    
    Args:
        cell_value: 셀 값 (예: "[D210000] 재무상태표, 유동/비유동법 - 연결")
        
    Returns:
        (sheet_id, fs_div, sj_div) 또는 None
    """
    if not cell_value or not isinstance(cell_value, str):
        return None
    
    # 정규표현식으로 파싱: [D210000] 재무상태표, 유동/비유동법 - 연결
    match = re.match(r'\[(D\d+)\]\s*(.+?)\s*-\s*(연결|별도)', cell_value.strip())
    if not match:
        return None
    
    sheet_id, name, report_type = match.groups()
    
    # fs_div 매핑 (연결/별도)
    fs_div = "CFS" if report_type == "연결" else "OFS"
    
    # sj_div 매핑 (보고서 종류)
    sj_div = "UNKNOWN"
    name_lower = name.lower()
    
    if "재무상태표" in name:
        sj_div = "BS"
    elif "손익계산서" in name:
        sj_div = "IS"
    elif "포괄손익" in name:
        sj_div = "CIS"
    elif "자본변동표" in name:
        sj_div = "SCE"
    elif "현금흐름표" in name:
        sj_div = "CF"
    
    if sj_div == "UNKNOWN":
        logger.warning(f"알 수 없는 재무제표 종류: {name}")
        return None
    
    return sheet_id, fs_div, sj_div


def extract_sheet_mappings(excel_file: BytesIO) -> List[SheetMapping]:
    """
    엑셀 파일의 Index 시트에서 시트 매핑 정보를 추출
    
    Args:
        excel_file: 엑셀 파일 BytesIO 객체
        
    Returns:
        시트 매핑 정보 리스트
    """
    mappings = []
    
    try:
        # Index 시트 읽기
        df_index = pd.read_excel(excel_file, sheet_name='Index', engine='openpyxl')
        
        # 모든 시트명 가져오기
        xl_file = pd.ExcelFile(excel_file, engine='openpyxl')
        all_sheets = xl_file.sheet_names
        
        logger.info(f"전체 시트 목록: {all_sheets}")
        
        # Index 시트에서 제목 정보 추출 (A열과 C열 우선 검사)
        for idx, row in df_index.iterrows():
            # A열과 C열을 우선적으로 검사
            priority_cols = []
            if len(df_index.columns) > 0:
                priority_cols.append(df_index.columns[0])  # A열
            if len(df_index.columns) > 2:
                priority_cols.append(df_index.columns[2])  # C열
            
            # 나머지 열들도 추가
            for col in df_index.columns:
                if col not in priority_cols:
                    priority_cols.append(col)
            
            for col in priority_cols:
                cell_value = str(row[col]) if pd.notna(row[col]) else ""
                
                if cell_value and '[D' in cell_value:
                    # 정규표현식으로 파싱
                    parsed = parse_index_row(cell_value)
                    
                    if parsed:
                        sheet_id, fs_div, sj_div = parsed
                        
                        # 실제 시트명 찾기 (시트 ID 기반 매칭)
                        matched_sheet = None
                        for sheet_name in all_sheets:
                            if sheet_id in sheet_name:
                                matched_sheet = sheet_name
                                break
                        
                        # 시트 ID로 찾지 못한 경우 부분 매칭 시도
                        if not matched_sheet:
                            for sheet_name in all_sheets:
                                if (sj_div == 'BS' and '재무상태표' in sheet_name) or \
                                   (sj_div == 'IS' and '손익' in sheet_name) or \
                                   (sj_div == 'CIS' and '포괄' in sheet_name) or \
                                   (sj_div == 'CF' and '현금' in sheet_name) or \
                                   (sj_div == 'SCE' and '자본' in sheet_name):
                                    
                                    if (fs_div == 'CFS' and '연결' in sheet_name) or \
                                       (fs_div == 'OFS' and '별도' in sheet_name):
                                        matched_sheet = sheet_name
                                        break
                        
                        if matched_sheet:
                            # 중복 방지
                            existing = [m for m in mappings if m.sheet_name == matched_sheet]
                            if not existing:
                                mappings.append(SheetMapping(
                                    sheet_name=matched_sheet,
                                    title=cell_value,
                                    fs_div=fs_div,
                                    sj_div=sj_div
                                ))
                                logger.info(f"시트 매핑 성공: {matched_sheet} -> {fs_div}/{sj_div}")
                        else:
                            logger.warning(f"매핑 실패 - 시트를 찾을 수 없음: {cell_value} (ID: {sheet_id})")
                    else:
                        logger.warning(f"매핑 실패 - 파싱 불가: {cell_value}")
    
    except Exception as e:
        logger.error(f"시트 매핑 추출 오류: {e}")
    
    logger.info(f"총 {len(mappings)}개 시트 매핑 완료")
    return mappings


def extract_corp_info_from_excel(excel_file: BytesIO) -> Tuple[Optional[str], Optional[int]]:
    """
    엑셀 파일에서 기업명과 연도 정보를 추출
    
    Args:
        excel_file: 엑셀 파일 BytesIO 객체
        
    Returns:
        (corp_name, year) 튜플
    """
    corp_name = None
    year = None
    
    try:
        # Index 시트에서 기업명과 연도 찾기
        df_index = pd.read_excel(excel_file, sheet_name='Index', engine='openpyxl')
        
        # 첫 몇 행에서 기업명과 연도 패턴 찾기
        for idx, row in df_index.head(10).iterrows():
            for col in df_index.columns:
                cell_value = str(row[col]) if pd.notna(row[col]) else ""
                
                # 연도 패턴 찾기 (2020-2030)
                if not year:
                    year_match = re.search(r'(20[2-3]\d)', cell_value)
                    if year_match:
                        year = int(year_match.group(1))
                
                # 기업명 패턴 찾기 (한글 포함, 주식회사 등)
                if not corp_name and len(cell_value) > 1:
                    if re.search(r'[가-힣]', cell_value) and ('주식회사' in cell_value or '㈜' in cell_value or len(cell_value.strip()) < 20):
                        # 특수문자 제거하고 기업명 추출
                        clean_name = re.sub(r'[^\w가-힣\s]', '', cell_value).strip()
                        if len(clean_name) > 1:
                            corp_name = clean_name
        
        # 기본값 설정
        if not year:
            year = 2023
        if not corp_name:
            corp_name = "업로드된 엑셀 기반 추정값"
            
    except Exception as e:
        logger.warning(f"기업 정보 추출 오류: {e}")
        corp_name = "업로드된 엑셀 기반 추정값"
        year = 2023
    
    return corp_name, year


def clean_amount_value(value) -> str:
    """
    금액 값을 정리하여 문자열로 변환 (음수 부호 보존)
    Args:
        value: 원본 값
    Returns:
        정리된 문자열 (쉼표 제거, 숫자만, 음수 부호는 맨 앞에만 허용)
    """
    if pd.isna(value) or value == "" or value == "-":
        return "0"
    str_value = str(value).strip()
    is_negative = str_value.startswith("-")
    # 숫자만 추출
    cleaned = re.sub(r'[^\d]', '', str_value)
    if cleaned == "":
        return "0"
    return f"-{cleaned}" if is_negative else cleaned


def extract_general_financial_data_from_sheet(excel_file: BytesIO, sheet_mapping: SheetMapping) -> Optional[FinancialStatementFromExcel]:
    """
    BS/IS/CF 시트에서 재무데이터를 추출
    """
    try:
        df = pd.read_excel(excel_file, sheet_name=sheet_mapping.sheet_name, engine='openpyxl', header=None, skiprows=4)
        if df.empty:
            logger.warning(f"빈 시트: {sheet_mapping.sheet_name}")
            return None
        df = df.dropna(how='all')
        df.columns = df.iloc[0]
        df = df[1:]
        account_col = df.columns[0]
        date_columns = []
        for col in df.columns[1:]:
            col_val = col
            col_str = str(col)
            if isinstance(col, datetime):
                date_columns.append(col_val)
                logger.debug(f"날짜 컬럼 발견 (datetime): {col_val}")
                continue
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", col_str):
                try:
                    parsed_date = datetime.strptime(col_str, "%Y-%m-%d")
                    date_columns.append(col_val)
                    logger.debug(f"날짜 컬럼 발견 (string): {col_val} -> {parsed_date}")
                except ValueError:
                    logger.debug(f"날짜 파싱 실패: {col_str}")
                    continue
            try:
                parsed = pd.to_datetime(col_str[:10], format="%Y-%m-%d", errors="raise")
                if col_val not in date_columns:
                    date_columns.append(col_val)
                    logger.debug(f"날짜 컬럼 발견 (pd.to_datetime): {col_val} -> {parsed}")
            except Exception:
                pass
        date_columns = sorted(date_columns, reverse=True)
        if len(date_columns) >= 3:
            thstrm_col = date_columns[1]
            frmtrm_col = date_columns[2]
        elif len(date_columns) >= 2:
            thstrm_col = date_columns[0]
            frmtrm_col = date_columns[1]
        else:
            logger.warning(f"충분한 날짜 컬럼이 없습니다: {sheet_mapping.sheet_name}")
            return None
        items = []
        for idx, row in df.iterrows():
            account_nm = str(row[account_col]) if pd.notna(row[account_col]) else ""
            if account_nm and account_nm.strip() and not account_nm.startswith('Unnamed'):
                thstrm_amount = clean_amount_value(row[thstrm_col])
                frmtrm_amount = clean_amount_value(row[frmtrm_col])
                items.append(FinancialStatementItem(
                    account_nm=account_nm.strip(),
                    thstrm_amount=thstrm_amount,
                    frmtrm_amount=frmtrm_amount
                ))
        if items:
            logger.info(f"데이터 추출 완료: {sheet_mapping.sheet_name}, {len(items)}개 항목")
            return FinancialStatementFromExcel(
                fs_div=sheet_mapping.fs_div,
                sj_div=sheet_mapping.sj_div,
                items=items
            )
    except Exception as e:
        logger.error(f"시트 데이터 추출 오류 ({sheet_mapping.sheet_name}): {e}")
    return None


def extract_sce_data_from_sheet(excel_file: BytesIO, sheet_mapping: SheetMapping) -> Optional[FinancialStatementFromExcel]:
    """
    자본변동표(SCE) 시트에서 2023년은 thstrm, 2022년은 frmtrm으로 매핑하여 반환
    """
    try:
        excel_file.seek(0)
        df = pd.read_excel(excel_file, sheet_name=sheet_mapping.sheet_name, engine='openpyxl', header=None, skiprows=4)
        df = df.dropna(how='all')
        df = df.reset_index(drop=True)
        period_row_indices = []
        period_years = []
        for i, val in enumerate(df.iloc[:, 0]):
            if isinstance(val, str):
                m = re.search(r"(\d{4})-\d{2}-\d{2}\s*~\s*(\d{4})-\d{2}-\d{2}", val)
                if m and m.group(1) == m.group(2):
                    year = m.group(1)
                    if year in ["2023", "2022"]:
                        period_row_indices.append(i)
                        period_years.append(year)
        col_priority = [2, 6, 5, 1, 4, 3]
        thstrm_block, frmtrm_block = None, None
        for idx, start_row in enumerate(period_row_indices):
            end_row = period_row_indices[idx+1] if idx+1 < len(period_row_indices) else len(df)
            block = df.iloc[start_row+1:end_row]
            if period_years[idx] == "2023":
                thstrm_block = block
            elif period_years[idx] == "2022":
                frmtrm_block = block
        results = []
        if thstrm_block is not None and frmtrm_block is not None:
            max_rows = max(len(thstrm_block), len(frmtrm_block))
            for row_idx in range(max_rows):
                thstrm_row = thstrm_block.iloc[row_idx] if row_idx < len(thstrm_block) else None
                frmtrm_row = frmtrm_block.iloc[row_idx] if row_idx < len(frmtrm_block) else None
                account_nm = str(thstrm_row.iloc[0]).strip() if thstrm_row is not None and not pd.isna(thstrm_row.iloc[0]) else (
                    str(frmtrm_row.iloc[0]).strip() if frmtrm_row is not None and not pd.isna(frmtrm_row.iloc[0]) else ""
                )
                if not account_nm or account_nm == 'nan':
                    continue
                for col_idx in col_priority:
                    thstrm_amount = "0"
                    frmtrm_amount = "0"
                    if thstrm_row is not None and col_idx < len(thstrm_row):
                        val = thstrm_row.iloc[col_idx]
                        thstrm_amount = clean_amount_value(val) if not pd.isna(val) and str(val).strip() != '' else "0"
                    if frmtrm_row is not None and col_idx < len(frmtrm_row):
                        val = frmtrm_row.iloc[col_idx]
                        frmtrm_amount = clean_amount_value(val) if not pd.isna(val) and str(val).strip() != '' else "0"
                    results.append({
                        "account_nm": account_nm,
                        "thstrm_amount": thstrm_amount,
                        "frmtrm_amount": frmtrm_amount
                    })
        if results:
            logger.info(f"자본변동표 2023(thstrm)/2022(frmtrm) 데이터 추출 완료: {sheet_mapping.sheet_name}, {len(results)}개 항목")
            return FinancialStatementFromExcel(
                fs_div=sheet_mapping.fs_div,
                sj_div=sheet_mapping.sj_div,
                items=[
                    FinancialStatementItem(
                        account_nm=item["account_nm"],
                        thstrm_amount=item["thstrm_amount"],
                        frmtrm_amount=item["frmtrm_amount"]
                    ) for item in results
                ]
            )
        else:
            logger.warning(f"자본변동표에서 2023/2022 데이터 항목을 찾지 못했습니다: {sheet_mapping.sheet_name}")
    except Exception as e:
        logger.warning(f"자본변동표 시트 파싱 오류 ({sheet_mapping.sheet_name}): {e}")
    return None


def extract_financial_data_from_sheet(excel_file: BytesIO, sheet_mapping: SheetMapping) -> Optional[FinancialStatementFromExcel]:
    if sheet_mapping.sj_div == "SCE":
        return extract_sce_data_from_sheet(excel_file, sheet_mapping)
    else:
        return extract_general_financial_data_from_sheet(excel_file, sheet_mapping)


def parse_financial_excel(file: UploadFile) -> Tuple[List[FinancialStatementFromExcel], Optional[str], Optional[int]]:
    """
    업로드된 엑셀 파일에서 재무제표 데이터를 파싱
    
    Args:
        file: 업로드된 엑셀 파일
        
    Returns:
        (파싱된 재무제표 리스트, 기업명, 연도) 튜플
    """
    statements = []
    corp_name = None
    year = None
    
    try:
        # 파일을 BytesIO로 읽기
        file_content = file.file.read()
        excel_file = BytesIO(file_content)
        
        # 1. 기업 정보 추출
        corp_name, year = extract_corp_info_from_excel(excel_file)
        excel_file.seek(0)
        
        # 2. Index 시트에서 매핑 정보 추출
        sheet_mappings = extract_sheet_mappings(excel_file)
        
        if not sheet_mappings:
            logger.warning("시트 매핑 정보를 찾을 수 없습니다.")
            return statements, corp_name, year
        
        # 3. 각 시트에서 데이터 추출
        for mapping in sheet_mappings:
            # 파일 포인터 리셋
            excel_file.seek(0)
            
            statement = extract_financial_data_from_sheet(excel_file, mapping)
            if statement:
                statements.append(statement)
        
        logger.info(f"엑셀 파싱 완료: {len(statements)}개 재무제표")
        
    except Exception as e:
        logger.error(f"엑셀 파싱 오류: {e}")
    
    finally:
        # 파일 포인터 리셋
        file.file.seek(0)
    
    return statements, corp_name, year 