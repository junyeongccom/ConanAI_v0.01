from typing import List
from app.domain.model.dsdcheck_schema import FinancialStatement, ComparisonResult

def compare_statements(
    excel: List[FinancialStatement], 
    dart: List[FinancialStatement]
) -> List[ComparisonResult]:
    def build_map(statements):
        result = {}
        for st in statements:
            for item in st.items:
                key = (st.fs_div, st.sj_div, item.account_nm)
                result[key] = item
        return result

    excel_map = build_map(excel)
    dart_map = build_map(dart)
    results = []

    for key in excel_map:
        if key in dart_map:
            excel_item = excel_map[key]
            dart_item = dart_map[key]
            for col in ["thstrm_amount", "frmtrm_amount"]:
                excel_val = int(excel_item.__dict__[col]) if excel_item.__dict__[col].lstrip('-').isdigit() else 0
                dart_val = int(dart_item.__dict__[col]) if dart_item.__dict__[col].lstrip('-').isdigit() else 0
                if excel_val != dart_val:
                    results.append(ComparisonResult(
                        fs_div=key[0],
                        sj_div=key[1],
                        account_nm=key[2],
                        column=col,
                        excel=str(excel_item.__dict__[col]),
                        dart=str(dart_item.__dict__[col]),
                        diff=excel_val - dart_val
                    ))
    return results 