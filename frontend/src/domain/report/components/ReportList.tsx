'use client';

import React from 'react';

export const ReportList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        생성된 보고서 목록
      </h2>
      <p className="text-gray-600 leading-relaxed">
        생성된 보고서를 확인하고 관리할 수 있는 페이지입니다.
        다양한 형태의 기후공시 보고서를 열람하고 다운로드할 수 있습니다.
      </p>
    </div>
  );
}; 