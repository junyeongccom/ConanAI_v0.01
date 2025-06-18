'use client';

import React from 'react';

export const DeveloperInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        개발팀 소개
      </h2>
      <p className="text-gray-600 leading-relaxed">
        SKY-C 개발팀은 기후 변화와 지속가능성 분야의 전문가들로 구성되어 있습니다.
        최신 기술과 국제 표준을 바탕으로 혁신적인 솔루션을 제공합니다.
      </p>
    </div>
  );
}; 