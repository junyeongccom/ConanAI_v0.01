/**
 * API 엔드포인트 상수
 */
export const TCFD_API_BASE_URL = '/api/tcfd'; // API Gateway를 통해 라우팅될 TCFD 서비스 엔드포인트
export const CHATBOT_API_URL = '/api/chatbot'; // Chatbot 서비스 엔드포인트

/**
 * TCFD 보고서 관련 API 엔드포인트
 */
export const TCFD_ENDPOINTS = {
  REPORTS: `${TCFD_API_BASE_URL}/reports`,
  GENERATE: `${TCFD_API_BASE_URL}/generate`,
  FINANCIAL_IMPACT: `${TCFD_API_BASE_URL}/financial-impact`,
} as const;

/**
 * 채팅봇 관련 API 엔드포인트
 */
export const CHATBOT_ENDPOINTS = {
  CHAT: `${CHATBOT_API_URL}/chat`,
  HELLO: `${CHATBOT_API_URL}/hello`,
} as const;

/**
 * 기본 채팅 프롬프트 템플릿
 */
export const DEFAULT_CHAT_PROMPTS = [
  "서울 지역 제조업의 폭염 재무 영향을 기반으로 TCFD 보고서 초안을 작성해줘.",
  "이 보고서의 '물리적 리스크' 섹션을 더 상세하게 작성해줘.",
  "생성된 보고서에서 '폭염일수'에 대한 데이터를 강조해줘.",
  "이전 보고서 목록을 보여줘."
] as const;

/**
 * 산업 유형별 설정
 */
export const INDUSTRY_TYPES = {
  manufacturing: {
    label: '제조업',
    description: '제조업체의 폭염 영향 분석',
    defaultFields: ['employeeCount', 'hourlyProductionValue']
  },
  construction: {
    label: '건설업',
    description: '건설업체의 폭염 영향 분석',
    defaultFields: ['employeeCount', 'dailyCost']
  },
  semiconductor: {
    label: '반도체업',
    description: '반도체업체의 폭염 영향 분석',
    defaultFields: ['employeeCount', 'hourlyProductionValue']
  }
} as const;

/**
 * 지역 설정
 */
export const REGIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'daegu', label: '대구' },
  { value: 'incheon', label: '인천' },
  { value: 'gwangju', label: '광주' },
  { value: 'daejeon', label: '대전' },
  { value: 'ulsan', label: '울산' },
] as const;

/**
 * 보고서 상태
 */
export const REPORT_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed'
} as const;

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'tcfd-chat-history',
  DRAFT_REPORTS: 'tcfd-draft-reports',
  USER_PREFERENCES: 'tcfd-user-preferences'
} as const;

/**
 * UI 관련 상수
 */
export const UI_CONSTANTS = {
  MAX_CHAT_MESSAGES: 100,
  CHAT_INPUT_MAX_LENGTH: 1000,
  REPORT_TITLE_MAX_LENGTH: 100,
  AUTO_SAVE_INTERVAL: 30000, // 30초
} as const; 