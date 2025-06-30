export interface IndicatorItemData {
  disclosure_id: string;
  topic: string | null;
  disclosure_ko: string;
}

export interface CategoryData {
  [categoryName: string]: IndicatorItemData[];
}

export interface StructuredIndicators {
  [sectionName: string]: CategoryData;
}

// 추가 타입들
export interface IndicatorViewerProps {
  data: StructuredIndicators;
}

export interface IndicatorTabsProps {
  data: StructuredIndicators;
}

export interface CategoryAccordionProps {
  categories: CategoryData;
}

export interface IndicatorItemProps {
  item: IndicatorItemData;
}

// input_schema 관련 타입 정의
export interface TableColumn {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
  options?: string[];
  is_source_column?: boolean;
}

export interface StructuredField {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
}

export interface TableInputSchema {
  type: 'table_input';
  columns: Array<{
    name: string;
    type: 'text' | 'number' | 'select';
    label: string;
    options?: string[];
  }>;
  dynamic_columns_from?: Array<{
    value_key: string;
    label_prefix: string;
    label_suffix: string;
    source_req_id: string;
  }>;
  source_requirement?: string;
  source_field_to_display?: string;
}

export interface StructuredListSchema {
  fields: StructuredField[];
  item_label?: string;
  type: 'structured_list';
}

export type InputSchema = TableInputSchema | StructuredListSchema | null;

// 타입 가드 함수들
export const isTableInputSchema = (schema: any): schema is TableInputSchema => {
  return schema && Array.isArray(schema.columns);
};

export const isStructuredListSchema = (schema: any): schema is StructuredListSchema => {
  return schema && Array.isArray(schema.fields);
};

// 요구사항 데이터 타입 정의
export interface RequirementData {
  requirement_id: string;
  disclosure_id: string | null;
  requirement_order: number;
  requirement_text_ko: string;
  data_required_type: string;
  input_schema: InputSchema;
  input_placeholder_ko: string | null;
  input_guidance_ko: string | null;
} 