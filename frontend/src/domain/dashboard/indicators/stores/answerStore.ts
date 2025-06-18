import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 개별 답변의 데이터 구조를 정의합니다.
 * 향후 'dirty' (DB에 미저장), 'saved' (DB에 저장됨) 등 상태를 추가하여
 * UI에 변경사항을 시각적으로 표시하는 데 사용할 수 있습니다.
 */
interface Answer {
  answer_value: any;
  status: 'dirty'; // 우선 'dirty' 상태만 정의
}

/**
 * 전체 답변 스토어의 상태와 액션을 정의합니다.
 */
interface AnswerState {
  // 상태: requirementId를 키로 사용하는 답변 객체
  answers: Record<number, Answer>;
  // 액션: 특정 답변을 추가하거나 수정합니다.
  setAnswer: (requirementId: number, value: any) => void;
  // 액션: DB에 제출할 형태로 모든 답변을 배열로 반환합니다.
  getAnswersForSubmission: () => Array<{ requirement_id: number; answer_value: any }>;
  // 액션: DB에 성공적으로 저장 후, 스토어의 모든 답변을 비웁니다.
  clearAnswers: () => void;
}

/**
 * 답변 관리를 위한 Zustand 스토어를 생성합니다.
 * persist 미들웨어를 사용하여 브라우저의 localStorage에 상태를 자동으로 저장합니다.
 */
export const useAnswerStore = create<AnswerState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      answers: {},

      // 액션 구현
      setAnswer: (requirementId, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [requirementId]: {
              answer_value: value,
              status: 'dirty', // 내용이 변경되었으므로 'dirty' 상태로 설정
            },
          },
        }));
      },

      getAnswersForSubmission: () => {
        const currentAnswers = get().answers;
        // 객체를 API가 요구하는 배열 형태로 변환
        return Object.entries(currentAnswers).map(([id, ans]) => ({
          requirement_id: Number(id),
          answer_value: ans.answer_value,
        }));
      },

      clearAnswers: () => {
        set({ answers: {} });
      },
    }),
    {
      // localStorage에 저장될 때 사용될 고유한 키 이름입니다.
      name: 'skyc-unsaved-answers',
      // 상태를 저장할 스토리지 종류를 명시합니다. (기본값은 localStorage)
      storage: createJSONStorage(() => localStorage),
    }
  )
); 