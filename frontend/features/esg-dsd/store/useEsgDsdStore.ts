import { create } from 'zustand';
import { extractEsgText } from '../services/api';

interface EsgDsdState {
  file: File | null;
  fileName: string;
  pageNum: string;
  extractedText: string | null;
  loading: boolean;
  error: string | null;
  setFile: (file: File) => void;
  setPageNum: (num: string) => void;
  extract: () => Promise<void>;
}

export const useEsgDsdStore = create<EsgDsdState>((set, get) => ({
  file: null,
  fileName: '',
  pageNum: '',
  extractedText: null,
  loading: false,
  error: null,

  setFile: (file: File) => {
    set({ 
      file, 
      fileName: file.name,
      error: null 
    });
  },

  setPageNum: (num: string) => {
    set({ pageNum: num });
  },

  extract: async () => {
    const { file, pageNum } = get();
    
    set({ 
      extractedText: null,
      error: null,
      loading: true 
    });

    if (!file) {
      set({ 
        error: '먼저 PDF 파일을 선택해주세요.',
        loading: false 
      });
      return;
    }

    if (!pageNum) {
      set({ 
        error: '페이지 번호를 입력해주세요.',
        loading: false 
      });
      return;
    }

    try {
      const extractedText = await extractEsgText(file, pageNum);
      set({ 
        extractedText,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('ESG 텍스트 추출 오류:', error);
      set({ 
        error: error instanceof Error ? error.message : 'PDF 업로드 중 오류가 발생했습니다.',
        loading: false
      });
    }
  }
})); 