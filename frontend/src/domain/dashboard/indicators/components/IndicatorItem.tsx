'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndicatorItemData, RequirementData } from '../types';
import { getRequirements } from '../services/indicatorAPI';
import { RequirementInputForm } from './RequirementInputForm';
import { Loader2, AlertCircle } from 'lucide-react'; // 로딩 및 에러 아이콘

interface IndicatorItemProps {
  item: IndicatorItemData;
}

export function IndicatorItem({ item }: IndicatorItemProps) {
  // --- 상태 관리 ---
  // UI의 확장/축소 상태를 제어합니다.
  const [isOpen, setIsOpen] = useState(false);
  // 요구사항 데이터 로딩 상태를 제어합니다.
  const [isLoading, setIsLoading] = useState(false);
  // API 호출 실패 시 에러 메시지를 저장합니다.
  const [error, setError] = useState<string | null>(null);
  // API로부터 받은 요구사항 데이터를 저장합니다.
  const [requirements, setRequirements] = useState<RequirementData[]>([]);

  // topic이 '목적'인 경우 입력창을 표시하지 않음
  const isInputDisabled = item.topic === '목적';

  // --- 이벤트 핸들러 ---
  // '입력' 또는 '닫기' 버튼 클릭 시 호출됩니다.
  const handleToggle = async () => {
    // topic이 '목적'인 경우 동작하지 않음
    if (isInputDisabled) return;

    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);

    // 항목을 처음 여는 경우에만 API를 호출하여 데이터를 가져옵니다. (캐싱 효과)
    if (nextIsOpen && requirements.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRequirements(item.disclosure_id);
        setRequirements(data);
      } catch (err) {
        // getRequirements에서 throw한 에러를 잡습니다.
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- 렌더링 ---
  return (
    <div className="border-t border-gray-200 first:border-t-0">
      {/* 항상 보이는 상단 영역 */}
      <div className={`flex items-start justify-between p-4 pl-8 transition-colors ${
        isInputDisabled 
          ? 'cursor-default' 
          : 'hover:bg-blue-50/50 cursor-pointer'
      }`} onClick={handleToggle}>
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
            isInputDisabled 
              ? 'bg-blue-400' 
              : 'bg-gray-400'
          }`} title={isInputDisabled ? '정보 제공' : '미작성'}></div>
          <div>
            <p className="text-sm font-medium text-gray-800">{item.disclosure_ko}</p>
            {isInputDisabled && (
              <p className="text-xs text-blue-600 mt-1">※ 이 항목은 정보 제공 목적이며 별도 입력이 필요하지 않습니다.</p>
            )}
          </div>
        </div>
        {!isInputDisabled && (
          <button className="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800 flex-shrink-0 flex items-center gap-1">
            {isOpen ? '닫기' : '입력'}
          </button>
        )}
      </div>

      {/* 확장/축소되는 하단 영역 (애니메이션 포함) */}
      <AnimatePresence initial={false}>
        {isOpen && !isInputDisabled && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="py-4 px-8 border-t border-gray-200 bg-gray-50">
              {/* 조건부 렌더링: 로딩, 에러, 성공 상태에 따라 다른 UI를 표시 */}
              {isLoading && (
                <div className="flex items-center justify-center py-5 gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>요구사항을 불러오는 중...</span>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center justify-center py-5 text-red-600">
                  <AlertCircle className="w-8 h-8 mb-2"/>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && (
                <RequirementInputForm requirements={requirements} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
} 