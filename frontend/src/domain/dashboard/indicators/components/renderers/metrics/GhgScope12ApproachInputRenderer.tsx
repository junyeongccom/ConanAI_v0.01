'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

interface GhgScope12ApproachInputRendererProps {
  requirement: any;
}

export function GhgScope12ApproachInputRenderer({ requirement }: GhgScope12ApproachInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || {};
  
  // input_schema에서 행과 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const columns = requirement.input_schema?.columns || [];

  // 값 변경 핸들러
  const handleValueChange = (rowKey: string, path: string, value: string) => {
    // 중첩된 경로로 값 설정
    const pathArray = path.split('.');
    const newData = { ...currentData };
    
    if (!newData[rowKey]) {
      newData[rowKey] = {};
    }
    
    let current = newData[rowKey];
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newData);
  };

  // 값 가져오기
  const getValue = (rowKey: string, path: string): string => {
    const pathArray = path.split('.');
    let current = currentData[rowKey];
    
    for (const key of pathArray) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    
    return current || '';
  };

  // 중첩된 컬럼들을 펼쳐서 입력 필드 경로 생성
  const flattenColumns = (columns: any[], parentPath: string = ''): Array<{path: string, label: string, isTextarea?: boolean}> => {
    const flattened: Array<{path: string, label: string, isTextarea?: boolean}> = [];
    
    columns.forEach((col: any) => {
      const currentPath = parentPath ? `${parentPath}.${col.key}` : col.key;
      
      if (col.sub_columns && col.sub_columns.length > 0) {
        flattened.push(...flattenColumns(col.sub_columns, currentPath));
      } else {
        flattened.push({
          path: currentPath,
          label: col.label,
          isTextarea: col.key === 'key_assumptions'
        });
      }
    });
    
    return flattened;
  };

  const flatColumns = flattenColumns(columns);

  return (
    <div className="mt-2">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            {/* 첫 번째 헤더 행 */}
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100" rowSpan={3}>
                구분
              </th>
              {columns.map((col: any, index: number) => (
                col.sub_columns && col.sub_columns.length > 0 ? (
                  <th 
                    key={index}
                    className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100"
                    colSpan={col.sub_columns.reduce((sum: number, subCol: any) => 
                      sum + (subCol.sub_columns ? subCol.sub_columns.length : 1), 0
                    )}
                  >
                    {col.label}
                  </th>
                ) : (
                  <th 
                    key={index}
                    className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100"
                    rowSpan={3}
                  >
                    {col.label}
                  </th>
                )
              ))}
            </tr>
            
            {/* 두 번째 헤더 행 */}
            <tr>
              {columns.map((col: any) => 
                col.sub_columns && col.sub_columns.length > 0 ? 
                  col.sub_columns.map((subCol: any, subIndex: number) => (
                    subCol.sub_columns && subCol.sub_columns.length > 0 ? (
                      <th 
                        key={subIndex}
                        className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-50"
                        colSpan={subCol.sub_columns.length}
                      >
                        {subCol.label}
                      </th>
                    ) : (
                      <th 
                        key={subIndex}
                        className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-50"
                        rowSpan={2}
                      >
                        {subCol.label}
                      </th>
                    )
                  )) : null
              )}
            </tr>
            
            {/* 세 번째 헤더 행 */}
            <tr>
              {columns.map((col: any) => 
                col.sub_columns && col.sub_columns.length > 0 ? 
                  col.sub_columns.map((subCol: any) => 
                    subCol.sub_columns && subCol.sub_columns.length > 0 ? 
                      subCol.sub_columns.map((subSubCol: any, subSubIndex: number) => (
                        <th 
                          key={subSubIndex}
                          className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-white"
                        >
                          {subSubCol.label}
                        </th>
                      )) : null
                  ) : null
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row: any) => (
              <tr key={row.key}>
                <td className="px-2 py-2 font-medium text-sm border border-gray-300 bg-gray-50">
                  {row.label}
                </td>
                {flatColumns.map((col) => (
                  <td key={col.path} className="px-2 py-2 border border-gray-300">
                    {col.isTextarea ? (
                      <TextareaAutosize
                        minRows={2}
                        maxRows={6}
                        className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                        value={getValue(row.key, col.path)}
                        onChange={(e) => handleValueChange(row.key, col.path, e.target.value)}
                        placeholder="내용을 입력하세요"
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                        value={getValue(row.key, col.path)}
                        onChange={(e) => handleValueChange(row.key, col.path, e.target.value)}
                        placeholder="입력"
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
        * Scope 1, 2 온실가스 배출량 산정 접근법에 대해 각 항목별로 구체적으로 작성해주세요.
      </div>
    </div>
  );
} 