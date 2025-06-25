import useAnswerStore from '@/shared/store/answerStore';
import isEqual from 'lodash.isequal';
import { useShallow } from 'zustand/react/shallow';

// ============================================================================
// 용도별 커스텀 훅들 (중앙 관제실 상태 소비)
// ============================================================================

/**
 * 로딩 상태만 가져오는 훅
 * 🎯 중앙 관제실의 로딩 모니터들에만 접근
 * ✅ useShallow로 무한 리렌더링 방지
 */
export const useAnswerLoadingState = () => {
  return useAnswerStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      isSaving: state.isSaving,
    }))
  );
};

/**
 * 에러 상태만 가져오는 훅
 * 🎯 중앙 관제실의 에러 모니터에만 접근
 * ✅ useShallow로 무한 리렌더링 방지
 */
export const useAnswerError = () => {
  return useAnswerStore(
    useShallow((state) => ({
      error: state.error,
      clearError: state.clearError,
    }))
  );
};

/**
 * 답변 데이터와 파생된 상태를 가져오는 훅
 * 🎯 중앙 관제실의 데이터 모니터들과 실시간 계산된 isDirty 상태
 * ✅ useShallow로 무한 리렌더링 방지
 */
export const useAnswers = () => {
  return useAnswerStore(
    useShallow((state) => {
      // 실시간으로 변경 여부를 계산 (파생 상태)
      const isDirty = !isEqual(state.initialAnswers, state.currentAnswers);
      
      return {
        currentAnswers: state.currentAnswers,
        initialAnswers: state.initialAnswers, // 디버깅이나 특정 로직을 위해 원본도 함께 제공
        isDirty,
      };
    })
  );
}; 