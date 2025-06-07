"use client";

import dynamic from 'next/dynamic';

const FinancialDsdPage = dynamic(() => import('@features/financial-dsd/components/FinancialDsdPage'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
});

export default FinancialDsdPage; 