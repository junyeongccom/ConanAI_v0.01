'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswerStore } from '../../../stores/answerStore';

interface InternalCarbonPriceInputRendererProps {
  requirement: any;
}

export function InternalCarbonPriceInputRenderer({ requirement }: InternalCarbonPriceInputRendererProps) {
  const { answers, setAnswer } = useAnswerStore();
  const currentAnswer = answers[requirement.requirement_id];
  
  const [data, setData] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  
  // input_schema에서 행 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  
  // 저장 함수
  const saveData = useCallback((newData: Record<string, string>) => {
    console.log('Saving internal carbon price data:', newData);
    setAnswer(requirement.requirement_id, newData);
  }, [requirement.requirement_id, setAnswer]);
  
  useEffect(() => {
    // 이미 초기화되었으면 실행하지 않음
    if (isInitialized) {
      return;
    }
    
    console.log('Initializing InternalCarbonPriceInputRenderer, currentAnswer:', currentAnswer);
    console.log('rows:', rows);
    
    if (rows.length === 0) {
      console.log('No rows available, skipping initialization');
      return;
    }
    
    // 저장된 답변이 있으면 복원
    if (currentAnswer && typeof currentAnswer === 'object' && Object.keys(currentAnswer).length > 0) {
      console.log('Restoring existing answer:', currentAnswer);
      setData(currentAnswer);
    } else {
      console.log('Initializing empty data for rows:', rows);
      // 초기화: 각 행별로 빈 문자열로 초기화
      const initialData: Record<string, string> = {};
      rows.forEach((row: any) => {
        initialData[row.key] = '';
      });
      console.log('Initial data:', initialData);
      setData(initialData);
    }
    
    setIsInitialized(true);
  }, [currentAnswer, rows, isInitialized]);

  // 값 변경 핸들러
  const handleValueChange = useCallback((rowKey: string, value: string) => {
    console.log('Value change:', { rowKey, value });
    
    setData(prevData => {
      const newData = { ...prevData, [rowKey]: value };
      console.log('New data after value change:', newData);
      return newData;
    });
  }, []);

  // 데이터가 변경될 때마다 저장 (디바운싱)
  useEffect(() => {
    // 초기화가 완료되지 않았으면 저장하지 않음
    if (!isInitialized) {
      console.log('Not initialized yet, skipping auto-save');
      return;
    }
    
    console.log('Data changed, current data:', data);
    
    if (Object.keys(data).length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-saving data:', data);
        saveData(data);
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [data, saveData, isInitialized]);

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
              value={data[row.key] || ''}
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