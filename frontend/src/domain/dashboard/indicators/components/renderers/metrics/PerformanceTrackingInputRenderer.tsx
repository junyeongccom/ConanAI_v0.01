'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";

interface PerformanceTrackingInputRendererProps {
  requirement: any;
}

export function PerformanceTrackingInputRenderer({ requirement }: PerformanceTrackingInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || [];
  
  // input_schema에서 설정 정보 가져오기
  const sourceRequirement = requirement.input_schema?.source_requirement;
  const columns = requirement.input_schema?.columns || [];
  
  // 소스 requirement에서 목표 데이터 가져오기
  const sourceData = sourceRequirement ? currentAnswers[sourceRequirement] : [];

  // 초기 데이터 구조 생성 함수
  const generateInitialData = () => {
    if (!sourceData || !Array.isArray(sourceData) || sourceData.length === 0) {
      return [];
    }

    return sourceData.map((sourceItem: any) => {
      const newItem: any = {};
      
      columns.forEach((col: any) => {
        if (col.type === 'read_only' && col.source_field) {
          newItem[col.key] = sourceItem[col.source_field] || '';
        } else {
          newItem[col.key] = '';
        }
      });
      
      return newItem;
    });
  };

  // 데이터가 없거나 비어있으면 초기 데이터로 설정
  React.useEffect(() => {
    if (sourceData && Array.isArray(sourceData) && sourceData.length > 0) {
      if (!currentData || !Array.isArray(currentData) || currentData.length === 0) {
        const initialData = generateInitialData();
        updateCurrentAnswer(requirement.requirement_id, initialData);
      }
    }
  }, [sourceData, currentData, requirement.requirement_id, updateCurrentAnswer]);

  // 값 변경 핸들러 - 공통 훅 사용
  const handleValueChange = (rowIndex: number, columnKey: string, value: string) => {
    console.log(`💡 PerformanceTracking 값 변경: [${rowIndex}].${columnKey} = ${value}`);
    updateCurrentAnswer(requirement.requirement_id, [
      ...currentData.slice(0, rowIndex),
      { ...currentData[rowIndex], [columnKey]: value },
      ...currentData.slice(rowIndex + 1)
    ]);
  };

  // 값 가져오기 - 공통 훅 사용
  const getValue = (rowIndex: number, columnKey: string): string => {
    return currentData[rowIndex][columnKey] || '';
  };

  if (!Array.isArray(currentData) || currentData.length === 0) {
    return (
      <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700 text-sm">
          성과 추적을 위해서는 먼저 기후 관련 목표를 설정해주세요. (met-21)
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {columns.map((col: any) => (
                  <td key={col.key} className="px-3 py-2 border-r border-gray-300">
                    {col.type === 'read_only' ? (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {row[col.key] || '-'}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={getValue(rowIndex, col.key)}
                        onChange={(e) => handleValueChange(rowIndex, col.key, e.target.value)}
                        placeholder={col.placeholder || '실적을 입력하세요'}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        * 설정한 기후 관련 목표 대비 당기의 성과를 입력해주세요. 회색 영역은 이전에 입력한 목표 정보입니다.
      </div>
    </div>
  );
} 