// Answer 도메인 API 서비스
import { api, handleApiError } from './apiClient';

// ============================================================================
// 타입 정의 (백엔드 Pydantic 스키마와 일치)
// ============================================================================

/**
 * 단일 답변 업데이트 요청 스키마
 */
export interface AnswerUpdatePayload {
  requirement_id: string;
  answer_data: any; // 다양한 타입의 답변 데이터 (string, number, boolean, object 등)
}

/**
 * 배치 답변 업데이트 요청 스키마
 */
export interface AnswerBatchUpdatePayload {
  answers: AnswerUpdatePayload[];
}

/**
 * 배치 답변 처리 응답 스키마
 */
export interface AnswerBatchResponse {
  success: boolean;
  message: string;
  processed_count: number;
  created_count: number;
  updated_count: number;
  failed_count: number;
  failed_requirements: string[];
}

/**
 * 답변 응답 스키마
 */
export interface AnswerResponse {
  answer_id: string;
  user_id: string;
  requirement_id: string;
  answer_value_text?: string | null;
  answer_value_number?: number | null;
  answer_value_boolean?: boolean | null;
  answer_value_date?: string | null; // ISO 날짜 문자열
  answer_value_json?: any | null;
  answered_at: string; // ISO 날짜 문자열
  last_edited_at: string; // ISO 날짜 문자열
}

// ============================================================================
// API 서비스 함수들
// ============================================================================

/**
 * 답변 배치 저장/업데이트 (UPSERT)
 * 
 * @param answers 저장할 답변 목록
 * @returns 처리 결과
 */
export const saveAnswersBatch = async (
  answers: AnswerUpdatePayload[]
): Promise<AnswerBatchResponse> => {
  try {
    console.log('🚀 답변 배치 저장 요청:', { count: answers.length });
    
    const payload: AnswerBatchUpdatePayload = { answers };
    
    const response = await api.post<AnswerBatchResponse>(
      '/api/disclosure/answers/batch',
      payload
    );
    
    console.log('✅ 답변 배치 저장 성공:', response);
    return response;
    
  } catch (error: any) {
    console.error('❌ 답변 배치 저장 실패:', error);
    const apiError = handleApiError(error);
    throw apiError;
  }
};

/**
 * 내 답변 목록 조회
 * 
 * @returns 사용자의 모든 답변 목록
 */
export const getMyAnswers = async (): Promise<AnswerResponse[]> => {
  try {
    console.log('🚀 내 답변 목록 조회 요청');
    
    const response = await api.get<AnswerResponse[]>(
      '/api/disclosure/answers/my'
    );
    
    console.log('✅ 내 답변 목록 조회 성공:', { count: response.length });
    return response;
    
  } catch (error: any) {
    console.error('❌ 내 답변 목록 조회 실패:', error);
    const apiError = handleApiError(error);
    throw apiError;
  }
};

/**
 * 특정 요구사항에 대한 내 답변 조회
 * 
 * @param requirementId 요구사항 ID
 * @returns 해당 요구사항에 대한 답변
 */
export const getMyAnswerByRequirement = async (
  requirementId: string
): Promise<AnswerResponse> => {
  try {
    console.log('🚀 특정 답변 조회 요청:', { requirementId });
    
    const response = await api.get<AnswerResponse>(
      `/api/disclosure/answers/my/${requirementId}`
    );
    
    console.log('✅ 특정 답변 조회 성공:', response);
    return response;
    
  } catch (error: any) {
    console.error('❌ 특정 답변 조회 실패:', error);
    const apiError = handleApiError(error);
    throw apiError;
  }
};

/**
 * 특정 요구사항에 대한 내 답변 삭제
 * 
 * @param requirementId 요구사항 ID
 * @returns 삭제 결과 메시지
 */
export const deleteMyAnswer = async (
  requirementId: string
): Promise<{ message: string }> => {
  try {
    console.log('🚀 답변 삭제 요청:', { requirementId });
    
    const response = await api.delete<{ message: string }>(
      `/api/disclosure/answers/my/${requirementId}`
    );
    
    console.log('✅ 답변 삭제 성공:', response);
    return response;
    
  } catch (error: any) {
    console.error('❌ 답변 삭제 실패:', error);
    const apiError = handleApiError(error);
    throw apiError;
  }
};

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * 답변 데이터 유효성 검증
 * 
 * @param answer 검증할 답변 데이터
 * @returns 유효성 검증 결과
 */
export const validateAnswerPayload = (answer: AnswerUpdatePayload): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!answer.requirement_id || answer.requirement_id.trim() === '') {
    errors.push('requirement_id는 필수입니다.');
  }
  
  if (answer.answer_data === undefined || answer.answer_data === null) {
    errors.push('answer_data는 필수입니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 배치 답변 데이터 유효성 검증
 * 
 * @param answers 검증할 답변 목록
 * @returns 유효성 검증 결과
 */
export const validateAnswersBatch = (answers: AnswerUpdatePayload[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!Array.isArray(answers) || answers.length === 0) {
    errors.push('답변 목록이 비어있습니다.');
    return { isValid: false, errors };
  }
  
  answers.forEach((answer, index) => {
    const validation = validateAnswerPayload(answer);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push(`답변 ${index + 1}: ${error}`);
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// Export
// ============================================================================

export default {
  saveAnswersBatch,
  getMyAnswers,
  getMyAnswerByRequirement,
  deleteMyAnswer,
  validateAnswerPayload,
  validateAnswersBatch,
}; 