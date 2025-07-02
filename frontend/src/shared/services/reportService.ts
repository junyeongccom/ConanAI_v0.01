import apiClient from '@/shared/services/apiClient';
import { ReportContentItem } from '@/shared/store/reportStore';

interface CreateReportResponse {
  message: string;
  data: ReportContentItem[];
}

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