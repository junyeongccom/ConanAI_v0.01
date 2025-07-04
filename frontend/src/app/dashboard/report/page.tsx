'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { SavedReportList } from '@/domain/dashboard/report/components/SavedReportList';
import type { Route } from 'next';

/**
 * 보고서 관리 메인 페이지
 * - 저장된 보고서 목록을 표시하고, 새 보고서 생성 페이지로 안내합니다.
 */
export default function ReportDashboardPage() {
  const router = useRouter();

  const handleNavigateToNewReport = () => {
    router.push('/dashboard/report/new' as Route);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">보고서 관리</h1>
          <p className="text-gray-600 mt-1">저장된 보고서를 확인하거나 새로운 ESG 보고서를 생성합니다.</p>
        </div>
        <Button onClick={handleNavigateToNewReport} size="lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 보고서 생성
        </Button>
      </div>

      <SavedReportList />
    </div>
  );
} 