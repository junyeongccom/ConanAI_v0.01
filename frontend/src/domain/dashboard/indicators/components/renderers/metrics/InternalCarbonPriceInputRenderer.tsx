'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';

interface InternalCarbonPriceInputRendererProps {
  requirement: any;
}

export function InternalCarbonPriceInputRenderer({ requirement }: InternalCarbonPriceInputRendererProps) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();

  const [data, setData] = useState(() => currentAnswers[requirement_id] || {});

  // 1. 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || {};
    if (JSON.stringify(globalValue) !== JSON.stringify(data)) {
      setData(globalValue);
    }
  }, [currentAnswers, requirement_id]);

  // 2. 로컬 상태 -> 전역 상태 디바운스 업데이트
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || {};
    if (JSON.stringify(data) === JSON.stringify(globalValue) || Object.keys(data).length === 0) {
      return;
    }

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving InternalCarbonPrice for ${requirement_id}...`);
      updateCurrentAnswer(requirement_id, data);
    }, 800);

    return () => clearTimeout(handler);
  }, [data, requirement_id, currentAnswers, updateCurrentAnswer]);
  
  const rows = input_schema?.rows || [];

  const handleValueChange = (rowKey: string, value: string) => {
    setData(prevData => ({ ...prevData, [rowKey]: value }));
  };

  const getValue = (rowKey: string): string => {
    return data[rowKey] || '';
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
              className="w-full p-2 border border-gray-200 rounded-md text-sm"
              value={getValue(row.key)}
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