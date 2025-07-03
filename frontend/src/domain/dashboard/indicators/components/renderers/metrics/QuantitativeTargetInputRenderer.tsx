'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface QuantitativeTargetInputRendererProps {
  requirement: any;
}

// 초기 행 데이터 구조
const createNewRow = (rowFields: any[]) => {
  const newRow: { [key: string]: any } = { id: Date.now() }; // 고유 ID로 key 생성
  rowFields.forEach(field => {
    newRow[field.name] = '';
  });
  return newRow;
};

export function QuantitativeTargetInputRenderer({ requirement }: QuantitativeTargetInputRendererProps) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();

  // 전체 데이터 구조: { years: {...}, rows: [...] }
  const [data, setData] = useState(() => currentAnswers[requirement_id] || { years: {}, rows: [] });

  const yearFields = input_schema?.year_fields || [];
  const rowFields = input_schema?.row_fields || [];

  // 전역 상태가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || { years: {}, rows: [] };
    if (JSON.stringify(globalValue) !== JSON.stringify(data)) {
      setData(globalValue);
    }
  }, [currentAnswers, requirement_id]);

  // 로컬 상태 변경 시 디바운싱하여 전역 상태 업데이트
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || { years: {}, rows: [] };
    if (JSON.stringify(data) === JSON.stringify(globalValue) || (Object.keys(data.years).length === 0 && data.rows.length === 0)) {
      return;
    }

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving QuantitativeTarget for ${requirement_id}...`);
      updateCurrentAnswer(requirement_id, data);
    }, 800);

    return () => clearTimeout(handler);
  }, [data, requirement_id, currentAnswers, updateCurrentAnswer]);

  const handleYearChange = (yearKey: string, value: string) => {
    setData(prev => ({ ...prev, years: { ...prev.years, [yearKey]: value } }));
  };

  const handleRowChange = (rowIndex: number, fieldName: string, value: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex][fieldName] = value;
    setData(prev => ({ ...prev, rows: newRows }));
  };
  
  const addRow = () => {
    const newRows = [...data.rows, createNewRow(rowFields)];
    setData(prev => ({...prev, rows: newRows}));
  };

  const removeRow = (rowIndex: number) => {
    const newRows = data.rows.filter((_, index) => index !== rowIndex);
    setData(prev => ({...prev, rows: newRows}));
  };
  
  return (
    <div className="mt-2 space-y-6">
      {/* 1. 연도 입력 섹션 */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3">연도 설정</h3>
        <div className="grid grid-cols-3 gap-4">
          {yearFields.map((field: any) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="예: 2030"
                value={data.years[field.key] || ''}
                onChange={(e) => handleYearChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. 테이블 입력 섹션 */}
      <div className="overflow-x-auto">
        <h3 className="text-md font-semibold text-gray-800 mb-3">정량 목표 입력</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {rowFields.map((field: any) => (
                <th key={field.name} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {field.label}
                </th>
              ))}
              {yearFields.map((field: any) => (
                <th key={field.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {data.years[field.key] || field.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.map((row: any, rowIndex: number) => (
              <tr key={row.id || rowIndex}>
                {/* 정적 필드 렌더링 */}
                {rowFields.map((field: any) => (
                  <td key={field.name} className="px-4 py-2 whitespace-nowrap">
                    {field.type === 'select' ? (
                      <select 
                        value={row[field.name]}
                        onChange={(e) => handleRowChange(rowIndex, field.name, e.target.value)}
                        className="w-full p-2 border-gray-300 rounded-md text-sm"
                      >
                         <option value="">-- 선택 --</option>
                        {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <TextareaAutosize
                        minRows={1}
                        className="w-full p-2 border-gray-300 rounded-md text-sm"
                        value={row[field.name]}
                        onChange={(e) => handleRowChange(rowIndex, field.name, e.target.value)}
                      />
                    )}
                  </td>
                ))}
                {/* 동적 연도 값 필드 렌더링 */}
                {yearFields.map((field: any) => (
                  <td key={field.key} className="px-4 py-2 whitespace-nowrap">
                    <TextareaAutosize
                      minRows={1}
                      className="w-full p-2 border-gray-300 rounded-md text-sm"
                      value={row[`${field.key}_value`] || ''}
                      onChange={(e) => handleRowChange(rowIndex, `${field.key}_value`, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-4 py-2 whitespace-nowrap">
                  <Button variant="ghost" size="icon" onClick={() => removeRow(rowIndex)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={addRow} variant="outline" className="mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          행 추가
        </Button>
      </div>
    </div>
  );
} 