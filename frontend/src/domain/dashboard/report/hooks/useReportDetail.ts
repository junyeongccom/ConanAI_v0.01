'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/shared/store/reportStore';

/**
 * 보고서 상세 정보 조회를 위한 비즈니스 로직을 관리하는 커스텀 훅
 * @param reportId - 조회할 보고서의 ID
 */
export const useReportDetail = (reportId: string) => {
  const {
    currentReport,
    isLoadingCurrentReport,
    savedReportError,
    fetchReportById,
    clearCurrentReport,
  } = useReportStore();

  useEffect(() => {
    if (reportId) {
      fetchReportById(reportId);
    }
    
    // 컴포넌트 언마운트 시, 현재 보고서 정보를 초기화
    return () => {
      clearCurrentReport();
    };
  }, [reportId, fetchReportById, clearCurrentReport]);

  return {
    report: currentReport,
    isLoading: isLoadingCurrentReport,
    error: savedReportError,
  };
}; 