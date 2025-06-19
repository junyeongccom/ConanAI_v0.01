export interface IndicatorItemData {
  disclosure_id: number;
  topic: string | null;
  paragraph?: string;
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

// 요구사항 데이터 타입 정의
export interface RequirementData {
  requirement_id: number;
  disclosure_id: number;
  requirement_order: number;
  requirement_text_ko: string;
  data_required_type: string;
  input_placeholder_ko: string | null;
  input_guidance_ko: string | null;
} 