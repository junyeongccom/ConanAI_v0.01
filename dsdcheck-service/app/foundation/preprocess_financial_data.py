from typing import List, Dict
import logging

from app.domain.model.dsdcheck_schema import (
    DartFinancialApiItem, 
    FinancialStatement, 
    FinancialItem
)

logger = logging.getLogger(__name__)


def group_by_statement_type(financial_data: List[DartFinancialApiItem]) -> Dict[str, List[DartFinancialApiItem]]:
    """
    재무제표 데이터를 sj_div(보고서 종류)별로 그룹화
    
    Args:
        financial_data: DART API 응답 데이터 리스트
        
    Returns:
        sj_div별로 그룹화된 딕셔너리
    """
    grouped = {}
    
    for item in financial_data:
        sj_div = item.sj_div
        if sj_div not in grouped:
            grouped[sj_div] = []
        grouped[sj_div].append(item)
    
    return grouped


def convert_to_financial_item(dart_item: DartFinancialApiItem) -> FinancialItem:
    """
    DART API 응답 항목을 FinancialItem으로 변환
    
    Args:
        dart_item: DART API 응답 개별 항목
        
    Returns:
        변환된 FinancialItem
    """
    return FinancialItem(
        account_nm=dart_item.account_nm,
        account_id=dart_item.account_id,
        thstrm_amount=dart_item.thstrm_amount or "0",
        frmtrm_amount=dart_item.frmtrm_amount or "0"
    )


def preprocess_financial_statements(raw_data: Dict[str, List[DartFinancialApiItem]]) -> List[FinancialStatement]:
    """
    원시 재무제표 데이터를 전처리하여 구조화된 형태로 변환
    
    Args:
        raw_data: {"CFS": [...], "OFS": [...]} 형태의 원시 데이터
        
    Returns:
        전처리된 FinancialStatement 리스트
    """
    statements = []
    
    for fs_div, data_list in raw_data.items():
        if not data_list:
            logger.warning(f"{fs_div} 데이터가 비어있습니다.")
            continue
        
        # sj_div별로 그룹화
        grouped_by_type = group_by_statement_type(data_list)
        
        for sj_div, items in grouped_by_type.items():
            # 각 항목을 FinancialItem으로 변환
            financial_items = []
            for dart_item in items:
                try:
                    financial_item = convert_to_financial_item(dart_item)
                    financial_items.append(financial_item)
                except Exception as e:
                    logger.warning(f"항목 변환 실패: {dart_item.account_nm}, 오류: {e}")
                    continue
            
            if financial_items:
                statement = FinancialStatement(
                    fs_div=fs_div,
                    sj_div=sj_div,
                    items=financial_items
                )
                statements.append(statement)
                logger.info(f"전처리 완료: {fs_div}-{sj_div}, {len(financial_items)}개 항목")
    
    return statements


def validate_financial_data(statements: List[FinancialStatement]) -> bool:
    """
    전처리된 재무제표 데이터의 유효성을 검증
    
    Args:
        statements: 전처리된 재무제표 리스트
        
    Returns:
        유효성 검증 결과
    """
    if not statements:
        logger.error("재무제표 데이터가 비어있습니다.")
        return False
    
    required_sj_divs = {"BS", "IS"}  # 최소 필요한 보고서 종류
    found_sj_divs = set()
    
    for statement in statements:
        found_sj_divs.add(statement.sj_div)
        
        if not statement.items:
            logger.warning(f"빈 재무제표 발견: {statement.fs_div}-{statement.sj_div}")
    
    missing_statements = required_sj_divs - found_sj_divs
    if missing_statements:
        logger.warning(f"누락된 필수 재무제표: {missing_statements}")
    
    logger.info(f"재무제표 검증 완료: {len(statements)}개 보고서, 발견된 종류: {found_sj_divs}")
    return True


def get_statement_summary(statements: List[FinancialStatement]) -> Dict[str, int]:
    """
    재무제표 요약 정보를 생성
    
    Args:
        statements: 재무제표 리스트
        
    Returns:
        요약 정보 딕셔너리
    """
    summary = {}
    
    for statement in statements:
        key = f"{statement.fs_div}_{statement.sj_div}"
        summary[key] = len(statement.items)
    
    return summary 