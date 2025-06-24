'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswerStore } from '../../../stores/answerStore';

interface GhgScope12ApproachInputRendererProps {
  requirement: any;
}

export function GhgScope12ApproachInputRenderer({ requirement }: GhgScope12ApproachInputRendererProps) {
  const { answers, setAnswer } = useAnswerStore();
  const currentAnswer = answers[requirement.requirement_id];
  
  const [data, setData] = useState<Record<string, any>>({});
  
  // input_schema에서 행과 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const columns = requirement.input_schema?.columns || [];
  
  useEffect(() => {
    // 저장된 답변이 있으면 복원
    if (currentAnswer && typeof currentAnswer === 'object') {
      setData(currentAnswer);
    }
  }, [currentAnswer]);

  // 값 변경 핸들러
  const handleValueChange = (rowKey: string, path: string, value: string) => {
    const newData = { ...data };
    
    // 중첩된 경로로 값 설정
    const pathArray = path.split('.');
    let current = newData;
    
    if (!current[rowKey]) {
      current[rowKey] = {};
    }
    current = current[rowKey];
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    setData(newData);
  };

  // 저장
  const saveToStore = () => {
    setAnswer(requirement.requirement_id, data);
  };

  // 값 가져오기
  const getValue = (rowKey: string, path: string): string => {
    const pathArray = path.split('.');
    let current = data[rowKey];
    
    for (const key of pathArray) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    
    return current || '';
  };

  // 중첩된 컬럼 헤더 렌더링을 위한 재귀 함수
  const renderNestedHeaders = (columns: any[], level: number = 0): JSX.Element[] => {
    const headers: JSX.Element[] = [];
    
    columns.forEach((col: any, index: number) => {
      if (col.sub_columns && col.sub_columns.length > 0) {
        headers.push(
          <th 
            key={`${level}-${index}`}
            className={`px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 ${
              level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-gray-50' : 'bg-white'
            }`}
            colSpan={col.sub_columns.length}
          >
            {col.label}
          </th>
        );
      } else {
        headers.push(
          <th 
            key={`${level}-${index}`}
            className={`px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 ${
              level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-gray-50' : 'bg-white'
            }`}
            rowSpan={3 - level}
          >
            {col.label}
          </th>
        );
      }
    });
    
    return headers;
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
                {flatColumns.map((flatCol, colIndex) => (
                  <td key={colIndex} className="px-2 py-2 border border-gray-300">
                    {flatCol.isTextarea ? (
                      <TextareaAutosize
                        minRows={2}
                        maxRows={6}
                        className="w-full p-1 border border-gray-200 rounded text-sm resize-none"
                        value={getValue(row.key, flatCol.path)}
                        onChange={(e) => handleValueChange(row.key, flatCol.path, e.target.value)}
                        onBlur={saveToStore}
                        placeholder="주요 가정을 입력하세요"
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-200 rounded text-sm"
                        value={getValue(row.key, flatCol.path)}
                        onChange={(e) => handleValueChange(row.key, flatCol.path, e.target.value)}
                        onBlur={saveToStore}
                        placeholder="내용을 입력하세요"
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
        * Scope 1, 2 온실가스 배출량 측정을 위해 적용한 접근법, 투입변수, 가정을 작성해주세요.
      </div>
    </div>
  );
} 