"use client";

import React from "react";

interface FinancialDsdUploaderProps {
  loading: boolean;
  error: string | null;
  fileName: string;
  sheetName: string;
  info: string | null;
  onSheetNameChange: (name: string) => void;
  onFileUpload: (file: File) => void;
}

export default function FinancialDsdUploader({ 
  loading,
  error,
  fileName,
  sheetName,
  info,
  onSheetNameChange,
  onFileUpload
}: FinancialDsdUploaderProps) {
  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  // 업로드 버튼 핸들러
  const handleUpload = () => {
    if (!fileName) {
      // 파일이 선택되지 않은 경우는 부모 컴포넌트에서 처리
      return;
    }
  };

  return (
    <div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* 안내 메시지 */}
      {info && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 mb-4">
          <p className="text-blue-700 dark:text-blue-300">{info}</p>
        </div>
      )}
      
      {/* 로딩 인디케이터 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            엑셀 파일 업로드
          </label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center justify-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
              <span>파일 선택</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              {fileName || "선택된 파일 없음"}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            시트 이름
          </label>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => onSheetNameChange(e.target.value)}
            placeholder="예: D210000"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
        >
          업로드 및 변환
        </button>
      </div>
    </div>
  );
} 