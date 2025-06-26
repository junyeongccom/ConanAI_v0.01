'use client';

import React, { useState, useEffect } from 'react';
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

  // 로컬 상태 관리 (하이브리드 상태 패턴)
  const [localValues, setLocalValues] = useState<Record<string, string>>(dataRecord);

  // 전역 상태 -> 로컬 상태 동기화 (초기값 설정)
  useEffect(() => {
    const newDataRecord: Record<string, string> = {};
    if (Array.isArray(currentData)) {
      currentData.forEach((item: any) => {
        if (item.scope && item.guideline !== undefined) {
          newDataRecord[item.scope] = item.guideline;
        }
      });
    }
    
    // 전역 상태와 로컬 상태가 다를 때만 업데이트
    const hasChanges = Object.keys(newDataRecord).some(key => 
      newDataRecord[key] !== localValues[key]
    ) || Object.keys(localValues).some(key => 
      localValues[key] !== (newDataRecord[key] || '')
    );

    if (hasChanges) {
      setLocalValues(newDataRecord);
    }
  }, [currentData, requirement.requirement_id]);

  // 로컬 상태 -> 전역 상태 동기화 (디바운싱)
  useEffect(() => {
    // 초기 로딩 시에는 실행하지 않음
    if (Object.keys(localValues).length === 0) return;

    // 현재 전역 상태와 로컬 상태가 같다면 실행하지 않음
    const currentDataRecord: Record<string, string> = {};
    if (Array.isArray(currentData)) {
      currentData.forEach((item: any) => {
        if (item.scope && item.guideline !== undefined) {
          currentDataRecord[item.scope] = item.guideline;
        }
      });
    }

    const hasRealChanges = Object.keys(localValues).some(key => 
      localValues[key] !== (currentDataRecord[key] || '')
    );

    if (!hasRealChanges) return;

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving ${requirement.requirement_id}...`);
      
      // 현재 전역 상태를 기반으로 새로운 배열 데이터 생성
      const newArrayData = rows.map((row: any) => ({
        scope: row.label,
        guideline: localValues[row.label] || ''
      }));
      
      updateCurrentAnswer(requirement.requirement_id, newArrayData);
    }, 500); // 500ms 지연

    return () => {
      clearTimeout(handler);
    };
  }, [localValues, requirement.requirement_id, updateCurrentAnswer, rows]);

  // 값 변경 핸들러 (로컬 상태만 업데이트)
  const handleValueChange = (scope: string, value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [scope]: value
    }));
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
                value={localValues[row.label] || ''}
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