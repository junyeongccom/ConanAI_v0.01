"use client";

import dynamic from 'next/dynamic';

const EsgDsdPage = dynamic(() => import('@features/esg-dsd/components/EsgDsdPage'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
});

export default EsgDsdPage; 