'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

interface InternalCarbonPriceInputRendererProps {
  value: any;
  onChange: (value: any) => void;
}

export function InternalCarbonPriceInputRenderer({ value, onChange }: InternalCarbonPriceInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[value.requirement_id] || {};
  
  // input_schema에서 행 정보 가져오기
  const rows = value.input_schema?.rows || [];

  // 로컬 상태 관리 (하이브리드 상태 패턴)
  const [localValues, setLocalValues] = useState<Record<string, string>>(currentData);

  // 전역 상태 -> 로컬 상태 동기화 (초기값 설정)
  useEffect(() => {
    const globalData = currentAnswers[value.requirement_id] || {};
    
    // 전역 상태와 로컬 상태가 다를 때만 업데이트
    const hasChanges = Object.keys(globalData).some(key => 
      globalData[key] !== localValues[key]
    ) || Object.keys(localValues).some(key => 
      localValues[key] !== (globalData[key] || '')
    );

    if (hasChanges) {
      setLocalValues(globalData);
    }
  }, [currentAnswers, value.requirement_id]);

  // 로컬 상태 -> 전역 상태 동기화 (디바운싱)
  useEffect(() => {
    // 초기 로딩 시에는 실행하지 않음
    if (Object.keys(localValues).length === 0) return;

    // 현재 전역 상태와 로컬 상태가 같다면 실행하지 않음
    const currentGlobalData = currentAnswers[value.requirement_id] || {};
    const hasRealChanges = Object.keys(localValues).some(key => 
      localValues[key] !== (currentGlobalData[key] || '')
    );

    if (!hasRealChanges) return;

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving ${value.requirement_id}...`);
      updateCurrentAnswer(value.requirement_id, localValues);
    }, 500); // 500ms 지연

    return () => {
      clearTimeout(handler);
    };
  }, [localValues, value.requirement_id, updateCurrentAnswer, currentAnswers]);

  // 값 변경 핸들러 (로컬 상태만 업데이트)
  const handleValueChange = (rowKey: string, inputValue: string) => {
    setLocalValues(prev => ({
      ...prev,
      [rowKey]: inputValue
    }));
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        {rows.map((row: any) => (
          <div key={row.key} className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {row.label}
            </label>
            <TextareaAutosize
              minRows={3}
              maxRows={8}
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={localValues[row.key] || ''}
              onChange={(e) => handleValueChange(row.key, e.target.value)}
              placeholder={`${row.label}에 대해 상세히 작성해주세요`}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        * 내부 탄소 가격제의 운영 방식에 대해 각 항목별로 구체적으로 작성해주세요.
      </div>
    </div>
  );
} 