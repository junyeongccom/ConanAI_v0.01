"use client";

import React from 'react';
import { useEsgDsd } from '../hooks/useEsgDsd';
import EsgErrorMessage from './EsgErrorMessage';
import EsgLoadingOverlay from './EsgLoadingOverlay';
import EsgUploadForm from './EsgUploadForm';
import EsgExtractedText from './EsgExtractedText';

export default function EsgDsdPage() {
  const { 
    fileName, 
    pageNum, 
    extractedText, 
    loading, 
    error, 
    setFile, 
    setPageNum, 
    extract 
  } = useEsgDsd();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          ESG 데이터 생성
        </h1>
        
        {error && <EsgErrorMessage error={error} />}
        {loading && <EsgLoadingOverlay />}
        
        <EsgUploadForm
          fileName={fileName}
          pageNum={pageNum}
          onFileChange={handleFileChange}
          onPageNumChange={setPageNum}
          onExtract={extract}
        />
        
        {extractedText && <EsgExtractedText extractedText={extractedText} />}
      </div>
    </div>
  );
} 