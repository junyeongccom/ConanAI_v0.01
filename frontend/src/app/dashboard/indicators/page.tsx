'use client';

import { useEffect, useState, useCallback } from 'react';
import { getStructuredIndicators } from '@/domain/dashboard/indicators/services/indicatorAPI';
import { IndicatorViewer } from '@/domain/dashboard/indicators/components/IndicatorViewer';
import { StructuredIndicators } from '@/domain/dashboard/indicators/types';
import { 
  useAnswers, 
  useAnswerLoadingState as useAnswerLoading, 
  useAnswerError 
} from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

// 페이지 헤더 컴포넌트
function IndicatorPageHeader() {
  const { isDirty } = useAnswers();
  const { isSaving } = useAnswerLoading();
  const saveChanges = useAnswerStore((state) => state.saveChanges);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSave = async () => {
    try {
      await saveChanges();
      // 저장 성공 시 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // 3초 후 자동 숨김
    } catch (error) {
      // 에러는 useAnswerError 훅으로 처리됨
      console.error('저장 실패:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">IFRS S2 공시 지표 관리</h1>
        <p className="text-gray-600">
          기후 관련 공시 지표를 체계적으로 관리하고 입력할 수 있습니다.
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* 성공 메시지 */}
        {showSuccessMessage && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            ✅ 저장이 완료되었습니다!
          </div>
        )}
        
        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`px-6 py-3 rounded-md font-semibold text-sm transition-colors ${
            isDirty && !isSaving 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              저장 중...
            </div>
          ) : (
            '답변 저장'
          )}
        </button>
      </div>
    </div>
  );
}

// 에러 알림 컴포넌트
function ErrorAlert() {
  const { error, clearError } = useAnswerError();

  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-red-800 mb-1">오류가 발생했습니다</h3>
          <p className="text-sm text-red-700">{error.message}</p>
        </div>
        <button
          onClick={clearError}
          className="text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function IndicatorsPage() {
  // 지표 데이터를 위한 로컬 상태 (indicators API는 답변 데이터와 별개)
  const [indicatorData, setIndicatorData] = useState<StructuredIndicators>({});
  const [isIndicatorLoading, setIsIndicatorLoading] = useState(true);

  // Zustand 스토어 상태들
  const { isLoading: isAnswerLoading } = useAnswerLoading();
  const initializeAnswers = useAnswerStore((state) => state.initializeAnswers);

  // 안전한 데이터 로딩 함수
  const loadData = useCallback(async () => {
    try {
      console.log('🚀 페이지 데이터 로딩 시작...');
      
      // 1. 지표 구조 데이터 로딩
      const indicators = await getStructuredIndicators();
      setIndicatorData(indicators);
      console.log('✅ 지표 구조 데이터 로딩 완료');
      
      // 2. 내 답변 데이터 초기화 (서버 + 로컬 병합)
      await initializeAnswers();
      console.log('✅ 답변 데이터 초기화 완료');
      
    } catch (error) {
      console.error('❌ 데이터 로딩 실패:', error);
    } finally {
      setIsIndicatorLoading(false);
    }
  }, [initializeAnswers]);

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 로딩 상태
  if (isIndicatorLoading || isAnswerLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {isIndicatorLoading ? '공시 지표 데이터를 불러오는 중...' : '답변 데이터를 불러오는 중...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 (제목 + 저장 버튼) */}
      <IndicatorPageHeader />
      
      {/* 에러 알림 */}
      <ErrorAlert />
      
      {/* 메인 콘텐츠 */}
      <IndicatorViewer data={indicatorData} />
    </div>
  );
} 