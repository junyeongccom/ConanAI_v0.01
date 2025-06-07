import { FileUploadResult, TableData, DsdUploadResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const financialDsdApi = {
  // 엑셀 파일 업로드 및 DSD 변환
  async uploadExcelFile(file: File): Promise<FileUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/financial-dsd/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'File upload failed');
    }

    return {
      data: result.data || [],
      headers: result.headers || []
    };
  },

  // DSD 데이터 생성
  async generateDsdData(tableData: any[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/financial-dsd/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: tableData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'DSD generation failed');
    }

    return result.data;
  }
};

export async function uploadDsdFile(file: File, sheetName?: string): Promise<{ tableData: TableData[]; headers: string[] }> {
  const formData = new FormData();
  formData.append('file', file);
  
  // sheetName이 비어있으면 쿼리스트링에서 sheet_name 파라미터를 빼고 요청
  let url = 'http://localhost:8080/api/dsdgen/dsdgen/upload';
  if (sheetName) {
    url += `?sheet_name=${sheetName}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data: DsdUploadResponse = await response.json();
  let tableData: TableData[] = [];
  let headers: string[] = [];

  if (sheetName) {
    if (data.sheets && data.sheets[sheetName] && data.sheets[sheetName].length > 0) {
      tableData = data.sheets[sheetName];
      if (tableData.length > 0) {
        headers = Object.keys(tableData[0]);
      }
    } else {
      throw new Error("시트 데이터가 없습니다.");
    }
  } else {
    // 시트명이 없으면 첫 번째 시트의 데이터를 보여줌
    const sheetNames = Object.keys(data.sheets);
    if (sheetNames.length > 0) {
      const firstSheet = sheetNames[0];
      tableData = data.sheets[firstSheet];
      if (tableData.length > 0) {
        headers = Object.keys(tableData[0]);
      }
    } else {
      throw new Error("시트 데이터가 없습니다.");
    }
  }

  return { tableData, headers };
} 