'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/shared/store/reportStore';
import { deleteReport } from '@/shared/services/reportService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

/**
 * 저장된 보고서 목록 페이지의 비즈니스 로직을 관리하는 커스텀 훅
 * - 저장된 보고서 목록 로딩 및 상태 관리
 * - 보고서 삭제 기능 제공
 */
export const useSavedReports = () => {
  const router = useRouter();
  const { 
    savedReports, 
    isLoadingSavedReports, 
    savedReportError,
    fetchSavedReports,
    clearSavedReports
  } = useReportStore();

  useEffect(() => {
    fetchSavedReports();
    return () => {
      clearSavedReports();
    };
  }, [fetchSavedReports, clearSavedReports]);

  const handleDeleteReport = async (reportId: string) => {
    const originalReports = savedReports;
    // Optimistic UI update
    useReportStore.setState(state => ({
      savedReports: state.savedReports.filter(report => report.id !== reportId)
    }));

    try {
      await deleteReport(reportId);
      toast.success('보고서가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('보고서 삭제에 실패했습니다.');
      // Rollback on failure
      useReportStore.setState({ savedReports: originalReports });
    }
  };

  const handleNavigateToNewReport = () => {
    router.push('/dashboard/report/new' as Route);
  }

  return {
    reports: savedReports,
    isLoading: isLoadingSavedReports,
    error: savedReportError,
    handleDeleteReport,
    handleNavigateToNewReport,
  };
}; 