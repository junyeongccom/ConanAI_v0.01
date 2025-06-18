'use client';

import React from 'react';

export const ProjectInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        SKY-C 프로젝트 소개
      </h2>
      <p className="text-gray-600 leading-relaxed">
        SKY-C는 기후 관련 재무 정보 공시를 위한 통합 플랫폼입니다.
        IFRS S2 기준에 따른 체계적인 기후공시를 지원합니다.
      </p>
    </div>
  );
}; 