'use client';

import { useEffect, useState } from 'react';
import { useReportStore } from '@/shared/store/reportStore';
import { saveReport } from '@/shared/services/reportService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Route } from 'next';

/**
 * 보고서 생성 및 저장 관련 비즈니스 로직을 관리하는 커스텀 훅
 */
export const useReportGenerator = () => {
  const router = useRouter();
  const {
    reportContent,
    isGenerating,
    error,
    generateReport,
    resetReport,
  } = useReportStore();
  
  const [isSaving, setIsSaving] = useState(false);

  // 컴포넌트 언마운트 시 스토어 상태 초기화
  useEffect(() => {
    return () => {
      resetReport();
    };
  }, [resetReport]);

  const handleSaveReport = async (title: string) => {
    if (!reportContent || reportContent.length === 0) {
      toast.error('저장할 보고서 내용이 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      const savedReport = await saveReport({
        title,
        report_data: reportContent,
      });
      toast.success(`'${title}' 보고서가 성공적으로 저장되었습니다.`);
      // 저장 후, 내 보고서 목록 페이지로 이동
      router.push('/dashboard/report' as Route);
    } catch (err) {
      toast.error('보고서 저장에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    reportContent,
    isGenerating,
    error,
    generateReport,
    isSaving,
    handleSaveReport,
  };
}; 