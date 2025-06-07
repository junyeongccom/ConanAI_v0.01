import { EsgExtractResponse } from '../types';

export async function extractEsgText(
  file: File,
  pageNum: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('page_num', pageNum);

  const response = await fetch('http://localhost:8080/api/esgdsd/extract', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('서버 응답이 올바르지 않습니다.');
  }

  const result: EsgExtractResponse = await response.json();
  
  if (result.status === 'success' && result.data && result.data.total_text) {
    return result.data.total_text;
  } else {
    throw new Error('텍스트 추출에 실패했습니다.');
  }
} 