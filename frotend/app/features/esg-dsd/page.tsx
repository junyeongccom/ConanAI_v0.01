"use client";

import React, { useState } from 'react';

export default function EsgDsdPage() {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [extractedText, setExtractedText] = useState<string | null>(null);

  // PDF 파일 업로드 핸들러
  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  // PDF 업로드 및 텍스트 추출 핸들러
  const handlePdfUpload = async () => {
    setExtractedText(null);
    if (!pdfFile) {
      setPdfError('먼저 PDF 파일을 선택해주세요.');
      return;
    }
    if (!pageNumber) {
      setPdfError('페이지 번호를 입력해주세요.');
      return;
    }
    setPdfLoading(true);
    setPdfError(null);
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('page_num', pageNumber);
    try {
      const response = await fetch('https://railwayesgdsd-production.up.railway.app/esgdsd/extract', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
      const result = await response.json();
      if (result.status === 'success' && result.data && result.data.total_text) {
        setExtractedText(result.data.total_text);
      } else {
        throw new Error('텍스트 추출에 실패했습니다.');
      }
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : 'PDF 업로드 중 오류가 발생했습니다.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">ESG 데이터 생성</h1>
        {/* 에러 메시지 */}
        {pdfError && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            <p>{pdfError}</p>
          </div>
        )}
        {/* 로딩 인디케이터 및 텍스트 추출 중 메시지 */}
        {pdfLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded shadow text-lg font-semibold text-gray-800 dark:text-white">
              텍스트 추출 중입니다...
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PDF 파일 업로드
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center justify-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                <span>파일 선택</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {pdfFileName || '선택된 파일 없음'}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              페이지 번호
            </label>
            <input
              type="text"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="예: 3"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            onClick={handlePdfUpload}
            disabled={pdfLoading}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
          >
            업로드 및 변환
          </button>
        </div>
        {/* 추출된 텍스트 결과 표시 */}
        {extractedText && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">추출된 텍스트</h2>
            <pre className="whitespace-pre-wrap break-all text-gray-700 dark:text-gray-200 text-base">{extractedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 