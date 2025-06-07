"use client";

import React from 'react';

export default function EsgLoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded shadow text-lg font-semibold text-gray-800 dark:text-white">
        텍스트 추출 중입니다...
      </div>
    </div>
  );
} 