'use client';

import { ReportDetailLayout } from '@/domain/dashboard/report/components/ReportDetailLayout';

interface PageProps {
  params: {
    reportId: string;
  };
}

/**
 * 보고서 상세 조회 동적 라우트 페이지
 * - URL에서 reportId를 추출하여 레이아웃 컴포넌트에 전달합니다.
 */
export default function ReportDetailPage({ params }: PageProps) {
  const { reportId } = params;

  return <ReportDetailLayout reportId={reportId} />;
} 