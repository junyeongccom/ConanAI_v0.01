'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswerStore } from '../../../stores/answerStore';

interface GhgGuidelineInputRendererProps {
  requirement: any;
}

export function GhgGuidelineInputRenderer({ requirement }: GhgGuidelineInputRendererProps) {
  const { answers, setAnswer } = useAnswerStore();
  const currentAnswer = answers[requirement.requirement_id];
  
  const [data, setData] = useState<Record<string, string>>({});
  
  // input_schema에서 행과 값 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const valueColumn = requirement.input_schema?.value_column || {};
  
  useEffect(() => {
    // 저장된 답변이 있으면 복원
    if (currentAnswer && Array.isArray(currentAnswer)) {
      const restoredData: Record<string, string> = {};
      currentAnswer.forEach((item: any) => {
        if (item.scope && item.guideline !== undefined) {
          restoredData[item.scope] = item.guideline;
        }
      });
      setData(restoredData);
    }
  }, [currentAnswer]);

  // 값 변경 핸들러
  const handleValueChange = (scope: string, value: string) => {
    const newData = {
      ...data,
      [scope]: value
    };
    setData(newData);
  };

  // 배열 형식으로 변환하여 저장
  const saveToStore = () => {
    const arrayData = rows.map((row: any) => ({
      scope: row.label,
      guideline: data[row.label] || ''
    }));
    
    setAnswer(requirement.requirement_id, arrayData);
  };

  // 입력 필드 onBlur 이벤트
  const handleBlur = () => {
    saveToStore();
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
                value={data[row.label] || ''}
                onChange={(e) => handleValueChange(row.label, e.target.value)}
                onBlur={handleBlur}
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