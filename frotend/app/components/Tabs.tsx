'use client';

import React from 'react';

interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-full bg-slate-100/10 p-1.5 border border-indigo-500/20 gap-2">
        <button
          onClick={() => onTabChange('financial')}
          className={`min-w-[160px] h-12 px-6 rounded-full text-base font-semibold transition-all duration-200 ${
            activeTab === 'financial'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-200/10 text-gray-300 hover:bg-slate-200/20 hover:text-white'
          }`}
        >
          재무공시
        </button>
        <button
          onClick={() => onTabChange('esg')}
          className={`min-w-[160px] h-12 px-6 rounded-full text-base font-semibold transition-all duration-200 ${
            activeTab === 'esg'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-200/10 text-gray-300 hover:bg-slate-200/20 hover:text-white'
          }`}
        >
          ESG공시
        </button>
      </div>
    </div>
  );
};

export default Tabs; 