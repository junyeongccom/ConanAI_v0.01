import { AnswerResponse, AnswerUpdatePayload } from '@/shared/services/answerService';

// ============================================================================
// 답변 데이터 변환 유틸리티 함수들
// ============================================================================

/**
 * AnswerResponse 배열을 Record<string, any> 형태로 변환
 * 
 * @param answers 서버에서 받은 답변 응답 배열
 * @returns requirement_id를 키로 하는 답변 데이터 Record
 */
export const transformAnswersToRecord = (answers: AnswerResponse[]): Record<string, any> => {
  const record: Record<string, any> = {};
  
  answers.forEach((answer) => {
    // 답변 데이터 추출 (타입별로 우선순위 적용)
    let answerData: any = null;
    
    if (answer.answer_value_text !== null && answer.answer_value_text !== undefined) {
      answerData = answer.answer_value_text;
    } else if (answer.answer_value_number !== null && answer.answer_value_number !== undefined) {
      answerData = answer.answer_value_number;
    } else if (answer.answer_value_boolean !== null && answer.answer_value_boolean !== undefined) {
      answerData = answer.answer_value_boolean;
    } else if (answer.answer_value_date !== null && answer.answer_value_date !== undefined) {
      answerData = answer.answer_value_date;
    } else if (answer.answer_value_json !== null && answer.answer_value_json !== undefined) {
      answerData = answer.answer_value_json;
    }
    
    record[answer.requirement_id] = answerData;
  });
  
  return record;
};

/**
 * 두 객체를 비교하여 변경된 항목들만 반환
 * 
 * @param original 원본 데이터 Record
 * @param current 현재 데이터 Record
 * @returns 변경된 항목들만 포함된 Record
 */
export const getChangedItems = (
  original: Record<string, any>, 
  current: Record<string, any>
): Record<string, any> => {
  const changed: Record<string, any> = {};
  
  // 현재 답변들을 순회하며 변경사항 확인
  Object.keys(current).forEach((requirementId) => {
    const originalValue = original[requirementId];
    const currentValue = current[requirementId];
    
    // JSON.stringify를 사용한 깊은 비교
    if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
      changed[requirementId] = currentValue;
    }
  });
  
  return changed;
};

/**
 * Record를 AnswerUpdatePayload 배열로 변환
 * 
 * @param record requirement_id를 키로 하는 답변 데이터 Record
 * @returns API 호출에 사용할 AnswerUpdatePayload 배열
 */
export const transformRecordToPayloads = (record: Record<string, any>): AnswerUpdatePayload[] => {
  return Object.entries(record).map(([requirementId, answerData]) => ({
    requirement_id: requirementId,
    answer_data: answerData,
  }));
};

/**
 * 객체의 깊은 복사를 수행
 * 
 * @param obj 복사할 객체
 * @returns 깊은 복사된 객체
 */
export const deepCopy = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // JSON 방식의 깊은 복사 (함수, undefined, Symbol 등은 제외됨)
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 두 객체가 깊은 비교에서 동일한지 확인
 * 
 * @param obj1 비교할 첫 번째 객체
 * @param obj2 비교할 두 번째 객체
 * @returns 깊은 비교 결과
 */
export const isDeepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}; 