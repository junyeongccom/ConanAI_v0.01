'use client';

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

interface GhgGuidelineInputRendererProps {
  requirement: any;
}

export function GhgGuidelineInputRenderer({ requirement }: GhgGuidelineInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || [];
  
  // input_schema에서 행과 값 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const valueColumn = requirement.input_schema?.value_column || {};
  
  // 배열 형태의 데이터를 객체 형태로 변환하여 사용
  const dataRecord: Record<string, string> = {};
  if (Array.isArray(currentData)) {
    currentData.forEach((item: any) => {
      if (item.scope && item.guideline !== undefined) {
        dataRecord[item.scope] = item.guideline;
      }
    });
  }

  // 값 변경 핸들러
  const handleValueChange = (scope: string, value: string) => {
    // 현재 전역 상태를 기반으로 새로운 배열 데이터 생성
    const newArrayData = rows.map((row: any) => ({
      scope: row.label,
      guideline: row.label === scope ? value : (dataRecord[row.label] || '')
    }));
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newArrayData);
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        {rows.map((row: any) => (
          <div key={row.key} className="flex items-start gap-4">
            <div className="w-24 flex-shrink-0 pt-2">
              <span className="text-sm font-medium text-gray-700">
                {row.label}
              </span>
            </div>
            <div className="flex-1">
              <TextareaAutosize
                minRows={2}
                maxRows={8}
                className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                placeholder={valueColumn.placeholder || '적용된 산정 방법론, 기준, 지침 등을 서술해주세요.'}
                value={dataRecord[row.label] || ''}
                onChange={(e) => handleValueChange(row.label, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        * 각 Scope별로 적용한 온실가스 배출량 측정 지침을 상세히 작성해주세요.
      </div>
    </div>
  );
} 