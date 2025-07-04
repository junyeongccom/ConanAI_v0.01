'use client';

import { useEffect, useState, useCallback } from 'react';
import { useReportStore } from '@/shared/store/reportStore';
import { SavedReportCreate } from '@/shared/services/reportService';

/**
 * 보고서 상세 정보 조회 및 수정을 위한 비즈니스 로직을 관리하는 커스텀 훅
 * @param reportId - 조회 및 수정할 보고서의 ID
 */
export const useReportDetail = (reportId: string) => {
  const {
    currentReport,
    isLoadingCurrentReport,
    savedReportError,
    fetchReportById,
    clearCurrentReport,
    updateReportContentItem,
    updateReportTableContentItem,
    updateReport,
  } = useReportStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  // 컴포넌트 마운트 시 및 currentReport 변경 시 editedTitle 초기화
  useEffect(() => {
    if (currentReport) {
      setEditedTitle(currentReport.title);
    }
  }, [currentReport]);
  
  // 보고서 데이터 fetching
  useEffect(() => {
    if (reportId) {
      fetchReportById(reportId);
    }
    
    return () => {
      clearCurrentReport();
    };
  }, [reportId, fetchReportById, clearCurrentReport]);

  // 수정 모드 토글
  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (currentReport) {
      setEditedTitle(currentReport.title);
    }
  }, [currentReport]);

  // 제목 변경 핸들러
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  }, []);

  // 보고서 본문 항목 변경 핸들러
  const handleContentChange = useCallback((index: number, newContent: string) => {
    updateReportContentItem(index, newContent);
  }, [updateReportContentItem]);

  // 테이블 셀 내용 변경 핸들러
  const handleTableCellChange = useCallback((itemIndex: number, rowIndex: number, cellIndex: number, newContent: string) => {
    updateReportTableContentItem(itemIndex, rowIndex, cellIndex, newContent);
  }, [updateReportTableContentItem]);

  // 변경 사항 저장 핸들러
  const handleSaveChanges = useCallback(async () => {
    if (!currentReport) return;

    const reportDataToUpdate: Partial<SavedReportCreate> = {
      title: editedTitle,
      report_data: currentReport.report_data,
    };

    const success = await updateReport(reportId, reportDataToUpdate);
    if (success) {
      setIsEditing(false);
      alert('보고서가 성공적으로 업데이트되었습니다.');
      fetchReportById(reportId); // 최신 데이터 다시 불러오기
    } else {
      alert('보고서 업데이트에 실패했습니다.');
    }
  }, [reportId, editedTitle, currentReport, updateReport, fetchReportById]);

  // 수정 취소 핸들러
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    if (currentReport) {
      setEditedTitle(currentReport.title);
      // 상태를 원래대로 되돌리기 위해 다시 fetch
      fetchReportById(reportId); 
    }
  }, [reportId, currentReport, fetchReportById]);

  return {
    report: currentReport,
    isLoading: isLoadingCurrentReport,
    error: savedReportError,
    isEditing,
    editedTitle,
    toggleEditing,
    handleTitleChange,
    handleContentChange,
    handleTableCellChange,
    handleSaveChanges,
    handleCancelEdit,
  };
}; 