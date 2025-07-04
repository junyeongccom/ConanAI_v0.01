import { create } from 'zustand';
import { 
  createReport,
  getSavedReports, 
  getSavedReportById,
  deleteReport,
  updateReport,
  SavedReportBrief,
  SavedReportDetail,
  SavedReportCreate,
} from '@/shared/services/reportService';

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
  // --- 보고서 생성 관련 상태 ---
  reportContent: ReportContentItem[] | null;
  isGenerating: boolean;
  error: string | null;
  generateReport: () => Promise<void>;
  resetReport: () => void;

  // --- 저장된 보고서 관련 상태 ---
  savedReports: SavedReportBrief[];
  currentReport: SavedReportDetail | null;
  isLoadingSavedReports: boolean;
  isLoadingCurrentReport: boolean;
  savedReportError: string | null;
  
  // --- 저장된 보고서 관련 액션 ---
  fetchSavedReports: () => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
  updateReportContentItem: (index: number, newContent: any) => void;
  updateReportTableContentItem: (itemIndex: number, rowIndex: number, cellIndex: number, newContent: string) => void;
  updateReport: (id: string, reportData: Partial<SavedReportCreate>) => Promise<boolean>;
  clearCurrentReport: () => void;
  clearSavedReports: () => void;
}

/**
 * 보고서 생성 및 관리를 위한 Zustand 스토어
 */
export const useReportStore = create<ReportState>((set) => ({
  // --- 초기 상태 ---
  reportContent: null,
  isGenerating: false,
  error: null,
  
  savedReports: [],
  currentReport: null,
  isLoadingSavedReports: false,
  isLoadingCurrentReport: false,
  savedReportError: null,
  
  // --- 액션 구현 ---

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

  /**
   * 저장된 모든 보고서 목록을 가져오는 액션
   */
  fetchSavedReports: async () => {
    set({ isLoadingSavedReports: true, savedReportError: null });
    try {
      const reports = await getSavedReports();
      set({ savedReports: reports, isLoadingSavedReports: false });
    } catch (error) {
      set({ 
        savedReportError: '저장된 보고서 목록을 불러오는데 실패했습니다.', 
        isLoadingSavedReports: false 
      });
    }
  },

  /**
   * ID로 특정 보고서의 상세 정보를 가져오는 액션
   */
  fetchReportById: async (id: string) => {
    set({ isLoadingCurrentReport: true, savedReportError: null, currentReport: null });
    try {
      const report = await getSavedReportById(id);
      set({ currentReport: report, isLoadingCurrentReport: false });
    } catch (error) {
      set({
        savedReportError: '보고서 상세 정보를 불러오는데 실패했습니다.',
        isLoadingCurrentReport: false,
      });
    }
  },

  /**
   * 상세 보기 중인 보고서의 특정 항목(content)을 업데이트합니다.
   * 이는 사용자가 수정 모드에서 입력 필드를 변경할 때 호출됩니다.
   * @param index - 업데이트할 항목의 report_data 배열 인덱스
   * @param newContent - 새로운 content 값
   */
  updateReportContentItem: (index: number, newContent: any) => {
    set((state) => {
      if (!state.currentReport || !state.currentReport.report_data) {
        return {};
      }

      // 새로운 report_data 배열 생성
      const newReportData = [...state.currentReport.report_data];
      
      // 해당 인덱스의 항목을 새로운 content로 업데이트
      if (newReportData[index]) {
        newReportData[index] = { ...newReportData[index], content: newContent };
      }
      
      // currentReport 상태를 새로운 데이터로 업데이트
      return {
        currentReport: {
          ...state.currentReport,
          report_data: newReportData,
        },
      };
    });
  },

  /**
   * 테이블 타입의 보고서 항목 내부의 특정 셀 데이터를 업데이트합니다.
   * @param itemIndex - report_data 배열에서 테이블 항목의 인덱스
   * @param rowIndex - 테이블의 행 인덱스
   * @param cellIndex - 테이블의 셀 인덱스
   * @param newContent - 새로운 셀의 내용
   */
  updateReportTableContentItem: (itemIndex: number, rowIndex: number, cellIndex: number, newContent: string) => {
    set((state) => {
      if (!state.currentReport?.report_data) return {};

      const newReportData = [...state.currentReport.report_data];
      const tableItem = newReportData[itemIndex];

      if (tableItem?.type === 'table' && tableItem.content?.rows) {
        const newRows = [...tableItem.content.rows];
        if (newRows[rowIndex]) {
          const newRow = [...newRows[rowIndex]];
          newRow[cellIndex] = newContent;
          newRows[rowIndex] = newRow;

          const newContentData = { ...tableItem.content, rows: newRows };
          newReportData[itemIndex] = { ...tableItem, content: newContentData };
          
          return {
            currentReport: {
              ...state.currentReport,
              report_data: newReportData,
            }
          }
        }
      }

      return {}; // 변경사항이 없으면 기존 상태 반환
    });
  },

  /**
   * 특정 보고서를 API를 통해 업데이트하는 액션
   * @param id - 업데이트할 보고서의 ID
   * @param reportData - 업데이트할 데이터 (제목 등)
   * @returns {Promise<boolean>} 성공 여부
   */
  updateReport: async (id: string, reportData: Partial<SavedReportCreate>) => {
    set({ isLoadingCurrentReport: true, savedReportError: null });
    try {
      const updatedReport = await updateReport(id, reportData);
      set({ currentReport: updatedReport, isLoadingCurrentReport: false });
      return true; // 성공
    } catch (error) {
      set({
        savedReportError: '보고서 업데이트에 실패했습니다.',
        isLoadingCurrentReport: false,
      });
      return false; // 실패
    }
  },

  /**
   * 현재 보고 있는 보고서 상세 정보를 초기화하는 액션
   */
  clearCurrentReport: () => {
    set({ currentReport: null });
  },
  
  /**
   * 저장된 보고서 목록 상태를 초기화하는 액션
   */
  clearSavedReports: () => {
    set({ savedReports: [], isLoadingSavedReports: false, savedReportError: null });
  }
})); 