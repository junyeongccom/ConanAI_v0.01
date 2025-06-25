'use client';

import React from 'react';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

interface GhgGasesInputRendererProps {
  requirement: any;
}

export function GhgGasesInputRenderer({ requirement }: GhgGasesInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || {};
  
  // input_schema에서 행과 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const columns = requirement.input_schema?.columns || [];

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (rowKey: string, columnKey: string, checked: boolean) => {
    // 현재 전역 상태를 기반으로 새로운 데이터 생성
    const newData = {
      ...currentData,
      [rowKey]: {
        ...currentData[rowKey],
        [columnKey]: checked
      }
    };
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newData);
  };

  return (
    <div className="mt-2">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                구분
              </th>
              {columns.map((col: any) => (
                <th key={col.key} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row: any) => (
              <tr key={row.key}>
                <td className="px-3 py-2 font-medium text-sm border-r border-gray-300">
                  {row.label}
                </td>
                {columns.map((col: any) => (
                  <td key={col.key} className="px-3 py-2 text-center border-r border-gray-300">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={currentData[row.key]?.[col.key] || false}
                      onChange={(e) => handleCheckboxChange(row.key, col.key, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        * 각 Scope별로 온실가스 배출량 산정에 포함된 온실가스 종류를 체크해주세요.
      </div>
    </div>
  );
} 