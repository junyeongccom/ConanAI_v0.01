'use client';

import React from 'react';

interface MetricInputCardProps {
  title: string;
  children: React.ReactNode;
  isDynamic?: boolean;
}

export function MetricInputCard({ title, children, isDynamic = false }: MetricInputCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${isDynamic ? 'ring-2 ring-blue-200' : ''}`}>
      <div className={`px-6 py-4 border-b border-gray-200 ${
        isDynamic ? 'bg-blue-50' : 'bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          {isDynamic && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          )}
          <h3 className={`text-lg font-semibold ${
            isDynamic ? 'text-blue-800' : 'text-gray-800'
          }`}>
            {isDynamic && '🎯 '}
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 