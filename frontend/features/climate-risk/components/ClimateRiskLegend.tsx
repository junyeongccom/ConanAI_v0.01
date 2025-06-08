"use client";

import React from 'react';

export default function ClimateRiskLegend() {
  const legendItems = [
    { color: '#fef3c7', label: '낮음 (0-10일)' },
    { color: '#fbbf24', label: '보통 (11-15일)' },
    { color: '#ea580c', label: '높음 (16-20일)' },
    { color: '#dc2626', label: '매우 높음 (21일+)' }
  ];

  return (
    <div className="flex items-center gap-4 mb-4 text-xs">
      <span className="font-medium text-gray-700">폭염일수 변화량:</span>
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
} 