import logging
import json
from typing import List, Dict, Any, Optional

from app.domain.model.report_entity import ReportTemplate

logger = logging.getLogger(__name__)

class TableGenerator:
    """JSON 데이터를 표 형식으로 변환하는 생성기"""

    async def generate_joined_table(self, template: ReportTemplate, driver_answer_data: Optional[List[Dict[str, Any]]], all_answers_dict: Dict[str, Any], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        두 개 이상의 요구사항에서 데이터를 '조인'하여 하나의 표를 생성합니다.
        - 'source_requirement'에 명시된 요구사항에서 기본 행 데이터를 가져옵니다.
        - 'driver_answer_data'에서 나머지 열의 데이터를 채웁니다.
        """
        title = template.content_template or ""
        
        # 1. 조인 정보 추출
        base_req_id = input_schema.get('source_requirement')
        base_field_key = input_schema.get('source_field_to_display')
        # 스키마에 레이블이 없을 경우를 대비한 기본값
        base_field_label = input_schema.get('source_field_label', '목표 지표') 

        if not base_req_id or not base_field_key:
            logger.warning(f"Joined table '{title}'의 input_schema에 'source_requirement' 또는 'source_field_to_display'가 없습니다.")
            return {"title": title, "headers": [], "rows": []}

        # 2. 헤더 구성
        primary_headers = [col.get('label', '') for col in input_schema.get('columns', [])]
        headers = [base_field_label] + primary_headers

        # 3. 기본 데이터(첫 번째 열) 추출
        base_answer_json = all_answers_dict.get(base_req_id)
        base_answer_data = {}
        if base_answer_json:
            if isinstance(base_answer_json, str) and base_answer_json:
                try:
                    base_answer_data = json.loads(base_answer_json)
                except json.JSONDecodeError:
                    logger.error(f"Joined Table의 베이스 데이터 JSON 파싱 실패: id='{base_req_id}'")
            else:
                base_answer_data = base_answer_json
        
        # 베이스 데이터의 형식을 확인하여 행 목록을 올바르게 추출
        base_rows_source = []
        # quantitative_target_input 형식 (dict이며 'rows' 키를 가짐) 처리
        if isinstance(base_answer_data, dict) and 'rows' in base_answer_data:
            base_rows_source = base_answer_data.get('rows', [])
        # 일반 table_input 형식 (list) 처리
        elif isinstance(base_answer_data, list):
            base_rows_source = base_answer_data
        else:
            logger.warning(f"Joined table '{title}'의 베이스 데이터 '{base_req_id}'의 형식을 알 수 없거나 비어있습니다 (발견된 타입: {type(base_answer_data)}).")
        
        base_column_values = [row.get(base_field_key, '') for row in base_rows_source]

        # 4. 드라이버 데이터(나머지 열) 준비
        primary_data_rows = driver_answer_data if driver_answer_data else []
        primary_column_keys = [col.get('name', '') for col in input_schema.get('columns', [])]
        
        # 5. 데이터 조인 및 최종 행 생성
        rows = []
        num_rows = len(base_column_values)
        for i in range(num_rows):
            base_value = base_column_values[i]
            # 기본 행의 순서에 맞춰 드라이버 데이터 매칭
            primary_row_data = primary_data_rows[i] if i < len(primary_data_rows) else {}
            
            new_row = [str(base_value)]
            for key in primary_column_keys:
                new_row.append(str(primary_row_data.get(key, '')))
            rows.append(new_row)
        
        logger.info(f"Joined table '{title}' 생성 완료: {len(rows)}개 행")
        return {"title": title, "headers": headers, "rows": rows}
        
    async def generate_simple_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        가장 기본적인 형태의 테이블을 생성합니다.
        input_schema의 'columns'를 헤더로 사용하고, answer_data의 리스트를 순회하며 행을 만듭니다.
        
        Args:
            template: 보고서 템플릿 정보
            answer_data: 사용자의 답변 데이터 (보통 dict의 리스트)
            input_schema: 테이블 구조를 정의하는 스키마
            
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

    async def generate_ghg_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        GHG 배출량 데이터(ghg_emissions_input)를 위한 전용 표를 생성합니다.
        input_schema 구조를 감지하여 두 가지 다른 종류의 테이블을 생성합니다:
        1. 동적 연도 컬럼 테이블 (met-1) - 'categories' 키 존재
        2. 적용 지침 테이블 (met-2) - 'rows'와 'value_column' 키 존재
        """
        title = template.content_template or ""
        
        # Schema-based dispatch
        # Case 1: Dynamic year columns table (e.g., met-1)
        if 'categories' in input_schema:
            logger.info(f"GHG 배출량 테이블 (동적 연도 유형) 생성 시작: '{title}'")
            return self._generate_dynamic_year_ghg_table(template, answer_data, input_schema)

        # Case 2: Guideline table (e.g., met-2)
        elif 'rows' in input_schema and 'value_column' in input_schema:
            logger.info(f"GHG 적용 지침 테이블 (고정 행 유형) 생성 시작: '{title}'")
            return self._generate_guideline_ghg_table(template, answer_data, input_schema)

        # Fallback for unknown schema
        else:
            logger.warning(f"GHG 배출량 테이블('{template.report_content_id}')을 위한 input_schema 구조를 알 수 없습니다.")
            return {"title": title, "headers": ["구분"], "rows": []}

    def _generate_dynamic_year_ghg_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        [Helper] input_schema의 카테고리를 고정 행으로, answer_data의 연도를 동적 열로 사용하는 표를 생성합니다.
        """
        title = template.content_template or ""
        
        categories = input_schema.get('categories', [])
        years = sorted(list(set(item['year'] for item in answer_data if 'year' in item)), reverse=True) if answer_data else []
        
        unit = "tCO2e" 
        headers = ["구분"] + [f"{year} ({unit})" for year in years]

        data_map = {}
        if answer_data:
            for item in answer_data:
                category = item.get('category')
                year = item.get('year')
                value = item.get('value', '')
                if category not in data_map:
                    data_map[category] = {}
                data_map[category][year] = str(value) if value is not None else ''

        rows = []
        for category_name in categories:
            display_name = category_name.lstrip()
            if category_name.startswith(' '):
                display_name = f"\u00A0\u00A0{display_name}"

            row_data = [display_name]
            for year in years:
                value = data_map.get(category_name, {}).get(year, '-')
                row_data.append(value if value else '-')
            
            rows.append(row_data)

        logger.info(f"GHG 배출량 테이블 (동적 연도 유형) 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        }

    def _generate_guideline_ghg_table(self, template: ReportTemplate, answer_data: Optional[List[Dict[str, Any]]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        [Helper] input_schema의 'rows'를 고정 행으로, 'value_column'을 값 컬럼으로 사용하는 표를 생성합니다.
        """
        title = template.content_template or ""
        
        value_column_label = input_schema.get('value_column', {}).get('label', '적용 지침')
        headers = ["구분", value_column_label]

        answer_map = {item['scope']: item.get('guideline', '') for item in answer_data} if answer_data else {}

        rows = []
        schema_rows = input_schema.get('rows', [])
        for schema_row in schema_rows:
            row_label = schema_row.get('label', '')
            guideline = answer_map.get(row_label, '')
            rows.append([row_label, guideline])
        
        logger.info(f"GHG 적용 지침 테이블 (고정 행 유형) 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        }

    async def generate_ghg_scope3_approach_table(self, template: ReportTemplate, answer_data: Optional[Dict[str, Any]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        계층적 행 구조를 가진 GHG Scope 3 접근법 표를 생성합니다.
        각 카테고리(c1-c15) 아래에 동적으로 추가된 여러 행을 표시하며, 중첩된 답변 객체에서 값을 찾습니다.
        """
        title = template.content_template or ""
        
        if not input_schema or 'columns' not in input_schema or 'rows' not in input_schema:
            logger.warning(f"GHG Scope 3 접근법 테이블('{template.report_content_id}')을 위한 input_schema가 올바르지 않습니다.")
            return {"title": title, "headers": ["구분"], "rows": []}

        # 1. 컬럼 평탄화 (경로를 리스트로 저장)
        flat_columns = []
        def _flatten_columns_recursive(columns, parent_label="", parent_path_list=None):
            if parent_path_list is None:
                parent_path_list = []
            for col in columns:
                current_path_list = parent_path_list + [col['key']]
                effective_label = col['label']
                if parent_label and parent_label != "투입변수":
                    effective_label = f"{parent_label} - {col['label']}"

                if "sub_columns" in col and col["sub_columns"]:
                    _flatten_columns_recursive(col["sub_columns"], col['label'], current_path_list)
                else:
                    flat_columns.append({"key": col['key'], "label": effective_label, "path": current_path_list})
        
        _flatten_columns_recursive(input_schema.get('columns', []))
        
        headers = ["구분"] + [col['label'] for col in flat_columns]
        
        # Helper to get value from nested dict
        def get_nested_value(data_dict, path_list):
            temp_dict = data_dict
            for key in path_list:
                if isinstance(temp_dict, dict):
                    temp_dict = temp_dict.get(key)
                else:
                    return ''
            return temp_dict if temp_dict is not None else ''

        # 2. 계층적 행 데이터 생성
        rows = []
        schema_rows = input_schema.get('rows', []) # C1-C15 카테고리 정의

        for category_schema in schema_rows:
            category_key = category_schema.get('key')
            category_label = category_schema.get('label', category_key)
            
            sub_rows_data = answer_data.get(category_key, []) if answer_data else []
            
            if not sub_rows_data or not any(sub_row for sub_row in sub_rows_data if len(sub_row) > 1):
                placeholder_row = [category_label] + ['-'] * len(flat_columns)
                rows.append(placeholder_row)
            else:
                is_first_sub_row = True
                for sub_row_item in sub_rows_data:
                    # id만 있는 빈 객체는 건너뛰기
                    if len(sub_row_item) <= 1 and 'id' in sub_row_item:
                        if is_first_sub_row:
                            rows.append([category_label] + ['-'] * len(flat_columns))
                            is_first_sub_row = False
                        continue

                    first_column = category_label if is_first_sub_row else ''
                    
                    # 중첩된 객체에서 경로를 이용해 데이터 추출
                    table_row_data = [str(get_nested_value(sub_row_item, col['path'])) for col in flat_columns]
                    
                    rows.append([first_column] + table_row_data)
                    is_first_sub_row = False

        logger.info(f"GHG Scope 3 접근법 테이블 생성 완료: '{title}' (총 행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        }

    async def generate_ghg_scope12_approach_table(self, template: ReportTemplate, answer_data: Optional[Dict[str, Any]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        복잡한 중첩 구조를 가진 온실가스 Scope 1 & 2 접근법 표를 생성합니다.
        input_schema의 중첩된 컬럼을 평탄화하고, 점(.)으로 구분된 키를 사용하여 답변 데이터에서 값을 찾습니다.
        """
        title = template.content_template or ""
        
        if not input_schema or 'columns' not in input_schema or 'rows' not in input_schema:
            logger.warning(f"GHG Scope 1&2 접근법 테이블('{template.report_content_id}')을 위한 input_schema가 올바르지 않습니다.")
            return {"title": title, "headers": ["구분"], "rows": []}

        # 1. 컬럼 평탄화 (재귀 헬퍼 함수 사용, 점 표기법 경로 생성)
        flat_columns = []
        def _flatten_columns_recursive(columns, parent_label="", parent_path=""):
            for col in columns:
                # 점 표기법 경로 생성
                current_path = f"{parent_path}.{col['key']}" if parent_path else col['key']

                effective_label = col['label']
                if parent_label and parent_label != "투입변수":
                    effective_label = f"{parent_label} - {col['label']}"

                if "sub_columns" in col and col["sub_columns"]:
                    # '투입변수'는 하위 컬럼으로 전달할 때 parent_label로 사용합니다.
                    _flatten_columns_recursive(col["sub_columns"], col['label'], current_path)
                else:
                    flat_columns.append({"key": col['key'], "label": effective_label, "path": current_path})
        
        _flatten_columns_recursive(input_schema.get('columns', []))
        
        headers = ["구분"] + [col['label'] for col in flat_columns]
        
        # 2. 행 데이터 생성
        rows = []
        schema_rows = input_schema.get('rows', [])
        for schema_row in schema_rows:
            row_key = schema_row.get('key')
            row_label = schema_row.get('label', row_key)
            
            table_row = [row_label]
            
            scope_data = answer_data.get(row_key, {}) if answer_data else {}
            
            # 평탄화된 컬럼 순서에 따라, 점 표기법 경로를 사용해 데이터 추출
            for col_info in flat_columns:
                value = scope_data.get(col_info['path'], '')
                table_row.append(str(value))
            
            rows.append(table_row)

        logger.info(f"GHG Scope 1&2 접근법 테이블 생성 완료: '{title}' (행: {len(rows)}개)")

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

    async def generate_ghg_gases_table(self, template: ReportTemplate, answer_data: Optional[Dict[str, Any]], input_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        고정된 행과 열을 가진 온실가스 종류 선택(ghg_gases_input) 표를 생성합니다.
        input_schema를 기반으로 테이블 구조를 만들고, answer_data로 체크박스 상태를 표시합니다.
        """
        title = template.content_template or ""
        
        if not input_schema or 'columns' not in input_schema or 'rows' not in input_schema:
            logger.warning(f"온실가스 종류 테이블('{template.report_content_id}')을 위한 input_schema가 올바르지 않습니다.")
            return {"title": title, "headers": ["구분"], "rows": []}

        schema_columns = input_schema.get('columns', [])
        schema_rows = input_schema.get('rows', [])

        headers = ["구분"] + [col.get('label', '') for col in schema_columns]
        column_keys = [col.get('key', '') for col in schema_columns]
        
        rows = []
        for schema_row in schema_rows:
            row_key = schema_row.get('key')
            row_label = schema_row.get('label', row_key)
            
            table_row = [row_label]
            
            scope_data = answer_data.get(row_key, {}) if answer_data else {}
            
            for col_key in column_keys:
                cell_value = '✔' if scope_data.get(col_key, False) else ''
                table_row.append(cell_value)
            
            rows.append(table_row)

        logger.info(f"온실가스 종류 테이블 생성 완료: '{title}' (행: {len(rows)}개)")

        return {
            "title": title,
            "headers": headers,
            "rows": rows
        } 