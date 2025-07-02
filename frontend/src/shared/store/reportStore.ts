import { create } from 'zustand';
import { createReport } from '@/shared/services/reportService';

/**
 * 보고서 콘텐츠 항목의 타입 정의
 * - type: 렌더링될 컴포넌트의 종류
 * - content: 실제 내용 (문자열, 테이블 데이터 등)
 * - content_template: (선택) 테이블과 같이 미구현된 항목을 위한 원본 템플릿
 */
export interface ReportContentItem {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'heading_4' | 'paragraph' | 'table' | 'error';
  content: any;
  content_template?: string; 
}

/**
 * 보고서 스토어의 상태(State)와 액션(Action) 타입 정의
 */
interface ReportState {
  reportContent: ReportContentItem[] | null;
  isGenerating: boolean;
  error: string | null;
  generateReport: () => Promise<void>;
  resetReport: () => void;
}

/**
 * 보고서 생성을 위한 Zustand 스토어
 */
export const useReportStore = create<ReportState>((set) => ({
  // 초기 상태
  reportContent: null,
  isGenerating: false,
  error: null,
  
  /**
   * 보고서 생성 프로세스를 시작하는 액션
   */
  generateReport: async () => {
    // 요청 시작 시, 로딩 상태로 변경하고 이전 데이터/에러를 초기화
    set({ isGenerating: true, error: null, reportContent: null });
    try {
      // reportService를 호출하여 API 요청
      const content = await createReport();
      // 성공 시, 받은 데이터로 상태 업데이트
      set({ reportContent: content, isGenerating: false });
    } catch (err) {
      // 실패 시, 에러 상태 업데이트
      set({ 
        error: '보고서 생성에 실패했습니다. 잠시 후 다시 시도해주세요.', 
        isGenerating: false 
      });
    }
  },

  /**
   * 스토어의 상태를 초기화하는 액션
   */
  resetReport: () => {
    set({ reportContent: null, isGenerating: false, error: null });
  },
})); 