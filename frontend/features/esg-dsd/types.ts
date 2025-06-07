export interface EsgExtractResponse {
  status: string;
  data: {
    total_text: string;
  };
}

export interface EsgDsdState {
  file: File | null;
  fileName: string;
  pageNum: string;
  extractedText: string | null;
  loading: boolean;
  error: string | null;
} 