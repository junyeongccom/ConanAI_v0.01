// 엑셀 테이블 데이터 타입
export interface TableData {
  [key: string]: any;
}

// API 응답 타입
export interface DsdUploadResponse {
  filename: string;
  sheets: Record<string, TableData[]>;
}

// 파일 업로드 관련 타입
export interface FileUploadResult {
  data: TableData[];
  headers: string[];
}

// 업로드 상태 타입
export interface UploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
} 