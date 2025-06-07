"use client";

import React from 'react';

interface EsgExtractedTextProps {
  extractedText: string;
}

export default function EsgExtractedText({ extractedText }: EsgExtractedTextProps) {
  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">추출된 텍스트</h2>
      <pre className="whitespace-pre-wrap break-all text-gray-700 dark:text-gray-200 text-base">
        {extractedText}
      </pre>
    </div>
  );
} 