'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

interface GhgGuidelineInputRendererProps {
  requirement: any;
}

export function GhgGuidelineInputRenderer({ requirement }: GhgGuidelineInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  const { requirement_id, input_schema } = requirement;
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement_id] || [];
  
  // input_schema에서 행과 값 컬럼 정보 가져오기
  const rows = input_schema?.rows || [];
  const valueColumn = input_schema?.value_column || {};
  
  // 배열 형태의 데이터를 객체 형태로 변환하여 사용
  const dataRecord: Record<string, string> = {};
  if (Array.isArray(currentData)) {
    currentData.forEach((item: any) => {
      if (item.scope && item.guideline !== undefined) {
        dataRecord[item.scope] = item.guideline;
      }
    });
  }

  // 공통 디바운싱 훅 사용
  const { updateValue, getValue: getInputValue } = useDebouncedObjectInput({
    onSave: (updates) => {
      console.log(`[Debounce] Saving ${requirement_id}...`);
      
      // 현재 전역 상태를 기반으로 새로운 배열 데이터 생성
      const newArrayData = rows.map((row: any) => {
        // updates에서 해당 scope의 값 찾기
        const scopeUpdate = Object.values(updates).find(({ path }: any) => path[0] === row.label);
        const guidelineValue = scopeUpdate ? scopeUpdate.value : (dataRecord[row.label] || '');
        
        return {
          scope: row.label,
          guideline: guidelineValue
        };
      });
      
      updateCurrentAnswer(requirement_id, newArrayData);
    }
  });

  // 값 변경 핸들러 - 공통 훅 사용
  const handleValueChange = (scope: string, value: string) => {
    console.log(`💡 Guideline 값 변경: ${scope} = ${value}`);
    updateValue([scope], value);
  };

  // 값 가져오기 - 공통 훅 사용
  const getValue = (scope: string): string => {
    return getInputValue([scope], dataRecord);
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
                value={getValue(row.label)}
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