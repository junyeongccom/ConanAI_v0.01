import apiClient from '@/shared/services/apiClient';
import { ReportContentItem } from '@/shared/store/reportStore';

interface CreateReportResponse {
  message: string;
  data: ReportContentItem[];
}

// --- API 요청 및 응답 타입 정의 ---

export interface SavedReportBrief {
  id: string; // UUID
  title: string;
  status: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
}

export interface SavedReportDetail extends SavedReportBrief {
  report_data: ReportContentItem[];
}

export interface SavedReportCreate {
  title: string;
  report_data: ReportContentItem[];
  status?: string;
}

// --- API 호출 함수 ---

/**
 * 백엔드에 보고서 생성을 요청하는 API 함수
 * @returns {Promise<ReportContentItem[]>} 생성된 보고서 콘텐츠 배열
 */
export const createReport = async (): Promise<ReportContentItem[]> => {
  try {
    // API 클라이언트를 사용하여 POST 요청을 보냅니다.
    // 백엔드 응답은 { message: string, data: ReportContentItem[] } 형식이므로,
    // 실제 콘텐츠인 response.data를 반환합니다.
    const response = await apiClient.post<CreateReportResponse>('/api/report/reports');
    return response.data;
  } catch (error) {
    console.error("보고서 생성 API 호출 실패:", error);
    // 에러를 상위로 전파하여 스토어에서 처리할 수 있도록 합니다.
    throw new Error("Failed to create report");
  }
};

/**
 * 생성된 보고서를 서버에 저장합니다.
 * @param reportData - 저장할 보고서 데이터 (제목, 내용 등)
 * @returns {Promise<SavedReportDetail>} 저장된 보고서의 상세 정보
 */
export const saveReport = async (reportData: SavedReportCreate): Promise<SavedReportDetail> => {
  try {
    const response = await apiClient.post<SavedReportDetail>('/api/report/reports/saved', reportData);
    return response;
  } catch (error) {
    console.error("보고서 저장 API 호출 실패:", error);
    throw new Error("Failed to save report");
  }
};

/**
 * 사용자가 저장한 모든 보고서 목록을 가져옵니다.
 * @returns {Promise<SavedReportBrief[]>} 저장된 보고서의 간략한 정보 배열
 */
export const getSavedReports = async (): Promise<SavedReportBrief[]> => {
  try {
    const response = await apiClient.get<SavedReportBrief[]>('/api/report/reports/saved');
    return response;
  } catch (error) {
    console.error("저장된 보고서 목록 조회 API 호출 실패:", error);
    throw new Error("Failed to fetch saved reports");
  }
};

/**
 * 특정 보고서의 상세 정보를 가져옵니다.
 * @param reportId - 조회할 보고서의 ID
 * @returns {Promise<SavedReportDetail>} 보고서의 상세 정보
 */
export const getSavedReportById = async (reportId: string): Promise<SavedReportDetail> => {
  try {
    const response = await apiClient.get<SavedReportDetail>(`/api/report/reports/saved/${reportId}`);
    return response;
  } catch (error) {
    console.error("보고서 상세 정보 조회 API 호출 실패:", error);
    throw new Error("Failed to fetch report details");
  }
};

/**
 * 특정 보고서를 삭제합니다.
 * @param reportId - 삭제할 보고서의 ID
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/report/reports/saved/${reportId}`);
  } catch (error) {
    console.error("보고서 삭제 API 호출 실패:", error);
    throw new Error("Failed to delete report");
  }
}; 