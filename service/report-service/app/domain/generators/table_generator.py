import logging
import json
from typing import List, Dict, Any, Optional

from app.domain.model.report_entity import ReportTemplate

logger = logging.getLogger(__name__)

class TableGenerator:
    """JSON 데이터를 표 형식으로 변환하는 생성기"""

    async def generate_simple_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        input_schema를 참조하여 동적으로 표를 생성합니다.
        답변 데이터가 없으면 빈 행을 가진 표의 '틀'을 생성합니다.

        Args:
            template: 보고서 템플릿 항목
            answer_data: 사용자의 답변 데이터 리스트 (Optional)
            input_schema: 답변 데이터의 구조를 정의하는 스키마

        Returns:
            {"title": ..., "headers": [...], "rows": [[...]]} 형식의 딕셔너리
        """
        title = template.content_template or ""
        headers = []
        column_keys = []
        rows = []

        # 1. 스키마에서 헤더(label)와 컬럼 키(name) 순서 추출 (데이터 존재 여부와 무관)
        if input_schema and 'columns' in input_schema and isinstance(input_schema['columns'], list):
            columns = input_schema.get('columns', [])
            headers = [col.get('label', col.get('name', '')) for col in columns]
            column_keys = [col.get('name', '') for col in columns]
        else:
            logger.warning(f"테이블 '{title}'의 헤더 정보를 위한 input_schema를 찾을 수 없습니다.")

        # 2. 답변 데이터가 있을 경우에만 행 데이터 생성
        if answer_data and isinstance(answer_data, list):
            for item in answer_data:
                if isinstance(item, dict):
                    row = [str(item.get(key, '')) for key in column_keys]
                    rows.append(row)
        
        logger.info(f"테이블 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        } 

    async def generate_internal_carbon_price_table(self, template: ReportTemplate, answer_data: Optional[Dict[str, Any]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        내부 탄소 가격 데이터(internal_carbon_price_input)를 위한 표를 생성합니다.
        단일 소스(met-14)의 답변과 스키마를 기반으로 2열 테이블을 만듭니다.
        """
        title = template.content_template or "내부 탄소 가격 상세"
        headers = ["구분", "기업 현황"]
        rows = []

        if not input_schema or 'rows' not in input_schema:
            logger.warning(f"내부 탄소 가격 테이블('{template.report_content_id}')을 위한 input_schema가 올바르지 않습니다.")
            return {"title": title, "headers": headers, "rows": []}

        # 스키마에 정의된 순서대로 행 생성
        schema_rows = input_schema.get('rows', [])
        for schema_row in schema_rows:
            key = schema_row.get('key')
            label = schema_row.get('label', key)
            
            # 답변 데이터가 있을 경우 값을 찾고, 없으면 빈 문자열 사용
            value = answer_data.get(key, "") if answer_data else ""
            rows.append([label, str(value)])

        logger.info(f"내부 탄소 가격 테이블 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        }

    async def generate_ghg_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        GHG 배출량 데이터(ghg_emissions_input)를 위한 전용 표를 생성합니다.
        연도 데이터를 동적으로 컬럼으로 만듭니다.

        Args:
            template: 보고서 템플릿 항목
            answer_data: 사용자의 답변 데이터 리스트 (Optional)

        Returns:
            {"title": ..., "headers": [...], "rows": [[...]]} 형식의 딕셔너리
        """
        title = template.content_template or ""
        rows = []
        headers = ["구분"]

        if not answer_data:
            logger.info(f"GHG 테이블 '{title}'에 대한 답변 데이터가 없습니다. 빈 테이블을 생성합니다.")
            return {
                "title": title,
                "headers": headers,
                "rows": rows
            }
        
        # 1. 데이터에서 모든 연도를 추출하고 정렬
        years = sorted(list(set(item.get('year') for item in answer_data if item.get('year'))), reverse=True)
        
        # 데이터에서 단위를 가져오되, 없으면 기본값 사용
        unit = "tCO2e"
        first_item_with_unit = next((item for item in answer_data if item.get('unit')), None)
        if first_item_with_unit:
            unit = first_item_with_unit.get('unit', 'tCO2e')

        headers.extend([f"{year} ({unit})" for year in years])

        # 2. Scope를 기준으로 데이터 재구성
        data_by_scope = {}
        for item in answer_data:
            scope = item.get('scope')
            year = item.get('year')
            value = item.get('value', '')
            if not scope or not year:
                continue
            
            if scope not in data_by_scope:
                data_by_scope[scope] = {y: '' for y in years}
            data_by_scope[scope][year] = str(value)

        # 3. 행 데이터 생성 (Scope 순서대로)
        scope_order = sorted(data_by_scope.keys()) 
        for scope in scope_order:
            row = [scope]
            row.extend([data_by_scope[scope][year] for year in years])
            rows.append(row)

        logger.info(f"GHG 테이블 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        } 

    async def generate_quantitative_target_table(self, template: ReportTemplate, answer_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        동적 연도 컬럼을 가진 정량적 목표 테이블(quantitative_target_input)을 생성합니다.
        answer_data에 포함된 years와 rows 정보를 기반으로 테이블을 재구성합니다.
        """
        title = template.content_template or ""
        
        # 기본 헤더 정의
        static_headers = ["목표 지표", "목적", "범위", "목표 유형"]
        
        if not answer_data or 'years' not in answer_data or 'rows' not in answer_data:
            logger.warning(f"정량 목표 테이블('{template.report_content_id}')을 위한 데이터가 부족합니다. years 또는 rows가 없습니다.")
            return {"title": title, "headers": static_headers, "rows": []}

        years_data = answer_data.get('years', {})
        rows_data = answer_data.get('rows', [])

        # 동적 연도 헤더 생성 (예: '2030년')
        year_headers = [f"{y}년" for y in years_data.values() if y]
        
        # 최종 헤더 조합
        headers = static_headers + year_headers
        
        rows = []
        if isinstance(rows_data, list):
            for row_item in rows_data:
                # 스키마에 정의된 순서대로 정적 열 데이터 추출
                row = [
                    row_item.get("target_metric", ""),
                    row_item.get("purpose", ""),
                    row_item.get("scope", ""),
                    row_item.get("target_type", "")
                ]
                # 동적 연도 열 데이터 추출
                for year_key in years_data.keys():
                    value_key = f"{year_key}_value"
                    row.append(row_item.get(value_key, ""))
                
                rows.append(row)

        logger.info(f"정량 목표 테이블 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        } 