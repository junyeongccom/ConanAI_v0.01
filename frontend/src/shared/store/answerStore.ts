import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { 
  getMyAnswers, 
  saveAnswersBatch, 
  AnswerUpdatePayload 
} from '@/shared/services/answerService';
import { ApiError } from '@/shared/services/apiClient';
import {
  transformAnswersToRecord,
  getChangedItems,
  transformRecordToPayloads
} from '@/shared/utils/answerTransformer';

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 답변 상태 인터페이스 (중앙 관제실의 모니터들)
 */
export interface AnswerState {
  // 데이터 상태
  initialAnswers: Record<string, any>;  // DB에서 온 원본 데이터 (requirement_id -> answer_data)
  currentAnswers: Record<string, any>;  // 사용자가 수정 중인 데이터 (requirement_id -> answer_data)
  
  // 로딩 및 에러 상태
  isLoading: boolean;                   // 초기 데이터 로딩 중 여부
  isSaving: boolean;                    // 저장 API 호출 중 여부
  error: ApiError | null;               // API 에러 객체
  
  // 참고: isDirty는 파생 상태로 useAnswers 훅에서 계산됨
}

/**
 * 답변 액션 인터페이스 (중앙 관제실의 조작 버튼들)
 */
export interface AnswerActions {
  // 데이터 로딩
  initializeAnswers: () => Promise<void>;
  
  // 답변 업데이트
  updateCurrentAnswer: (requirementId: string, answerData: any) => void;
  
  // 변경 사항 저장
  saveChanges: () => Promise<void>;
  
  // 유틸리티
  resetState: () => void;
  clearError: () => void;
  getAnswerByRequirement: (requirementId: string) => any | null;
  getChangedAnswers: () => AnswerUpdatePayload[];
}

/**
 * 전체 스토어 타입
 */
export type AnswerStore = AnswerState & AnswerActions;

// ============================================================================
// 초기 상태
// ============================================================================

const initialState: AnswerState = {
  initialAnswers: {},
  currentAnswers: {},
  isLoading: false,
  isSaving: false,
  error: null,
};

// ============================================================================
// 중앙 관제실 스토어 생성 (persist + devtools)
// ============================================================================

const useAnswerStore = create<AnswerStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // ========================================================================
        // 액션 구현 (중앙 관제실의 조작 버튼들)
        // ========================================================================

        /**
         * 답변 데이터 초기화 - 서버 데이터와 로컬 데이터를 지능적으로 병합
         * 🎯 데이터 유실 방지를 위한 지능적 병합 로직
         */
        initializeAnswers: async () => {
          console.log('🚀 [AnswerStore] 답변 데이터 초기화 시작');

          // 1. 로컬에 저장된 미반영 데이터를 먼저 가져온다.
          const localCurrentAnswers = get().currentAnswers;

          set({ isLoading: true, error: null }, false, 'initializeAnswers/start');

          try {
            // 2. 서버에서 최신 저장본을 가져온다.
            const serverResponses = await getMyAnswers();
            const serverAnswersRecord = transformAnswersToRecord(serverResponses);

            // 3. 병합 로직 실행
            // 3-1. 원본(initial)은 항상 서버 데이터를 기준으로 한다.
            const newInitialAnswers = serverAnswersRecord;

            // 3-2. 편집본(current)은 서버 데이터 위에 로컬 데이터를 덮어쓴다.
            const newCurrentAnswers = {
              ...serverAnswersRecord,
              ...localCurrentAnswers,
            };

            console.log('✅ [AnswerStore] 서버 데이터와 로컬 데이터 병합 완료');

            // 4. 병합된 데이터로 최종 상태를 설정한다.
            set(
              {
                initialAnswers: newInitialAnswers,
                currentAnswers: newCurrentAnswers,
                isLoading: false,
              },
              false,
              'initializeAnswers/success'
            );

          } catch (error: any) {
            console.error('❌ [AnswerStore] 데이터 초기화 실패:', error);
            set({ isLoading: false, error: error as ApiError }, false, 'initializeAnswers/error');
          }
        },

        /**
         * 특정 요구사항의 답변을 업데이트
         * 🎯 오직 currentAnswers만 수정하여 변경 추적 가능
         */
        updateCurrentAnswer: (requirementId: string, answerData: any) => {
          console.log('🔄 [AnswerStore] 답변 업데이트:', { requirementId, answerData });
          
          const { currentAnswers } = get();
          
          // 새로운 현재 답변 상태 생성
          const newCurrentAnswers = {
            ...currentAnswers,
            [requirementId]: answerData,
          };
          
          set(
            {
              currentAnswers: newCurrentAnswers,
              error: null, // 입력 시 에러 상태 클리어
            },
            false,
            'updateCurrentAnswer'
          );
        },

        /**
         * 변경사항을 서버에 저장
         * 🎯 변경된 답변들만 식별하여 효율적으로 저장
         */
        saveChanges: async () => {
          console.log('💾 [AnswerStore] 변경사항 저장 시작');
          
          const { initialAnswers, currentAnswers } = get();
          
          // 변경된 답변들만 추출
          const changedItems = getChangedItems(initialAnswers, currentAnswers);
          const changedPayloads = transformRecordToPayloads(changedItems);
          
          // 변경사항이 없으면 종료
          if (changedPayloads.length === 0) {
            console.log('📭 [AnswerStore] 저장할 변경사항이 없습니다.');
            return;
          }
          
          console.log('🚀 [AnswerStore] 저장할 변경사항:', { count: changedPayloads.length });
          
          set({ isSaving: true, error: null }, false, 'saveChanges/start');
          
          try {
            // API 호출
            const result = await saveAnswersBatch(changedPayloads);
            console.log('✅ [AnswerStore] 변경사항 저장 성공:', result);
            
            // 저장 성공 시, 현재 상태를 새로운 초기 상태로 설정 (깊은 복사)
            set(
              {
                initialAnswers: JSON.parse(JSON.stringify(get().currentAnswers)), // 🔧 깊은 복사로 데이터 독립성 보장
                isSaving: false,
                error: null,
              },
              false,
              'saveChanges/success'
            );
            
          } catch (error: any) {
            console.error('❌ [AnswerStore] 변경사항 저장 실패:', error);
            
            set(
              {
                isSaving: false,
                error: error as ApiError,
              },
              false,
              'saveChanges/error'
            );
          }
        },

        /**
         * 스토어 상태 초기화
         */
        resetState: () => {
          console.log('🔄 [AnswerStore] 상태 초기화');
          
          set(
            { ...initialState },
            false,
            'resetState'
          );
        },

        /**
         * 에러 상태 클리어
         */
        clearError: () => {
          set({ error: null }, false, 'clearError');
        },

        /**
         * 특정 요구사항의 현재 답변 데이터 조회
         */
        getAnswerByRequirement: (requirementId: string) => {
          const { currentAnswers } = get();
          return currentAnswers[requirementId] || null;
        },

        /**
         * 변경된 답변들을 AnswerUpdatePayload 배열로 반환
         */
        getChangedAnswers: () => {
          const { initialAnswers, currentAnswers } = get();
          const changedItems = getChangedItems(initialAnswers, currentAnswers);
          return transformRecordToPayloads(changedItems);
        },
      }),
      {
        name: 'answer-storage', // localStorage 키 이름
        storage: createJSONStorage(() => localStorage),
        // 사용자 입력 데이터만 영속화 (로딩/에러 상태는 제외)
        partialize: (state) => ({
          currentAnswers: state.currentAnswers,
          initialAnswers: state.initialAnswers,
        }),
      }
    ),
    {
      name: 'answer-store', // DevTools에서 표시될 이름
    }
  )
);

export default useAnswerStore; 