'use client';

import React from 'react';

export default function EsgDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          🚧 구현중입니다
        </h1>
        <p className="text-xl text-gray-300">
          ESG 공시 자동화 시스템을 준비하고 있습니다.<br />
          조금만 기다려주세요!
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-lg font-semibold transform transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
          >
            메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
} 