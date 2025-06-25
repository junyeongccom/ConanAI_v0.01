'use client';

import { useState, useEffect } from 'react';
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

  // 값 변경 핸들러
  const handleValueChange = (rowKey: string, value: string) => {
    // 현재 전역 상태를 기반으로 새로운 데이터 생성
    const newData = { ...currentData, [rowKey]: value };
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(value.requirement_id, newData);
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
              value={currentData[row.key] || ''}
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