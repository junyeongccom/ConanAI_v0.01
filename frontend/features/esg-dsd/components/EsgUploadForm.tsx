"use client";

import React from 'react';

interface EsgUploadFormProps {
  fileName: string;
  pageNum: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageNumChange: (value: string) => void;
  onExtract: () => void;
}

export default function EsgUploadForm({
  fileName,
  pageNum,
  onFileChange,
  onPageNumChange,
  onExtract
}: EsgUploadFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 mb-4">
        <p className="text-yellow-700 dark:text-yellow-300">
          ⚠️ ESG 데이터 생성 기능은 현재 개발 중입니다. 곧 서비스될 예정입니다.
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          PDF 파일 업로드
        </label>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-400 text-white font-medium rounded-md cursor-not-allowed transition-colors">
            <span>파일 선택 (비활성화)</span>
            <input
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="hidden"
              disabled
            />
          </label>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            {fileName || '선택된 파일 없음'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          페이지 번호
        </label>
        <input
          type="text"
          value={pageNum}
          onChange={(e) => onPageNumChange(e.target.value)}
          placeholder="예: 3"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200"
          disabled
        />
      </div>
      
      <button
        onClick={onExtract}
        disabled={true}
        className="px-4 py-2 bg-gray-400 text-white font-medium rounded-md cursor-not-allowed transition-colors"
      >
        업로드 및 변환 (비활성화)
      </button>
    </div>
  );
} 