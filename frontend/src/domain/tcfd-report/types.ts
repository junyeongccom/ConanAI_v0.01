/**
 * TCFD 보고서 메타데이터
 */
export interface ReportMetadata {
  id: string;
  fileName: string;
  createdAt: string;
  lastModifiedAt: string;
  status: 'draft' | 'completed'; // 초안 또는 완료
}

/**
 * TCFD 보고서 섹션
 */
export interface ReportSection {
  id: string;
  title: string;
  content: string; // SLM이 생성한 텍스트
  sourceDataRefs?: { // SLM이 참조한 데이터 (예: 폭염일수, 재무 영향 금액)
    type: 'climate' | 'financial';
    dataId: string;
    value: any;
  }[];
}

/**
 * TCFD 보고서 전체 구조
 */
export interface TCFDReport {
  metadata: ReportMetadata;
  sections: ReportSection[];
}

/**
 * 재무 영향 계산을 위한 입력 데이터
 */
export interface FinancialImpactInput {
  industryType: 'manufacturing' | 'construction' | 'semiconductor';
  region: string;
  // 각 산업별 필요한 입력 값들을 여기에 정의 (예: employeeCount, hourlyProductionValue, dailyCost etc.)
  // 폭염일수는 백엔드에서 가져올 것이므로 여기서는 직접 입력하지 않습니다.
  employeeCount?: number;
  hourlyProductionValue?: number;
  dailyCost?: number;
}

/**
 * 채팅 메시지 타입
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reportId?: string; // 관련된 보고서 ID (선택적)
}

/**
 * 채팅 세션 타입
 */
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  lastMessageAt: string;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 보고서 생성 요청 타입
 */
export interface ReportGenerationRequest {
  prompt: string;
  financialInput?: FinancialImpactInput;
  existingReportId?: string; // 기존 보고서 수정 시
} 