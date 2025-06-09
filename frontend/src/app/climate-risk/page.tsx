"use client";

import dynamic from 'next/dynamic';

const ClimateRiskPage = dynamic(() => import('@domain/climate-risk/components/ClimateRiskPage'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
});

export default ClimateRiskPage; 