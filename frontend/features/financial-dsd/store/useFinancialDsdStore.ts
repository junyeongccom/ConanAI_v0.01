import { create } from 'zustand';
import { TableData } from '../types';
import { uploadDsdFile } from '../services/api';

interface FinancialDsdState {
  tableData: TableData[];
  headers: string[];
  loading: boolean;
  error: string | null;
  fileName: string;
  sheetName: string;
  info: string | null;
  setSheetName: (name: string) => void;
  upload: (file: File) => Promise<void>;
}

export const useFinancialDsdStore = create<FinancialDsdState>((set, get) => ({
  tableData: [],
  headers: [],
  loading: false,
  error: null,
  fileName: '',
  sheetName: '',
  info: null,
  
  setSheetName: (name: string) => {
    set({ sheetName: name });
  },
  
  upload: async (file: File) => {
    const { sheetName } = get();
    
    set({ 
      info: null,
      error: null,
      loading: true,
      fileName: file.name
    });
    
    if (!sheetName) {
      set({ info: "시트명을 입력하지 않으면 자동으로 모든 시트가 변환됩니다." });
    }
    
    try {
      const { tableData, headers } = await uploadDsdFile(file, sheetName);
      set({ 
        tableData, 
        headers, 
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("DSD 업로드 오류:", error);
      set({ 
        error: error instanceof Error ? error.message : "DSD 업로드 중 오류가 발생했습니다.",
        loading: false
      });
    }
  }
})); 