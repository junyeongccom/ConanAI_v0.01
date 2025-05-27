'use client';

import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 180, height = 50, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      <svg 
        viewBox="0 0 240 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* 뇌 + 회로 모양 아이콘 */}
        <g className="logo-icon">
          <path 
            d="M30 10C21.7157 10 15 16.7157 15 25C15 33.2843 21.7157 40 30 40C38.2843 40 45 33.2843 45 25C45 16.7157 38.2843 10 30 10Z" 
            fill="url(#brain-gradient)" 
          />
          <path 
            d="M30 38C26.5 38 23.5 36.5 22 34.5C21.5 33.8 21.2 33 21 32.5M25 15C23.5 15.5 22.3 16.3 21.5 17.5C20.8 18.5 20.5 19.8 20.5 21C20.5 22.5 21 24 22 25.2"
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <path 
            d="M30 15C31.5 15 32.8 15.2 34 16C35.2 16.8 36 18 36.5 19.2M36.5 30C35.8 31.5 34.5 33 33 34C32 34.5 31 35 30 35"
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          {/* 회로 라인들 */}
          <path d="M8 25H15" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M45 25H52" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 45V48" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 2V10" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 25V42H11" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 25V42H49" stroke="#4F6BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* 데이터 포인트/노드 */}
          <circle cx="8" cy="25" r="2" fill="#4BE1FF" />
          <circle cx="52" cy="25" r="2" fill="#4BE1FF" />
          <circle cx="30" cy="48" r="2" fill="#4BE1FF" />
          <circle cx="11" cy="42" r="2" fill="#4BE1FF" />
          <circle cx="49" cy="42" r="2" fill="#4BE1FF" />
        </g>
        
        {/* ConanAI 텍스트 */}
        <text 
          x="65" 
          y="35" 
          fill="url(#text-gradient)" 
          className="font-bold" 
          style={{ 
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", 
            fontSize: "24px", 
            fontWeight: "700" 
          }}
        >
          Conan<tspan fill="#4BE1FF">AI</tspan>
        </text>
        
        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="brain-gradient" x1="15" y1="10" x2="45" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F6BFF" />
            <stop offset="100%" stopColor="#4BE1FF" />
          </linearGradient>
          <linearGradient id="text-gradient" x1="65" y1="15" x2="160" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo; 