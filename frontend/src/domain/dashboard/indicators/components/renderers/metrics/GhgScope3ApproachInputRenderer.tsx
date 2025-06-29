'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';

interface GhgScope3ApproachInputRendererProps {
  requirement: any;
}

export function GhgScope3ApproachInputRenderer({ requirement }: GhgScope3ApproachInputRendererProps) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  
  const [data, setData] = useState(() => currentAnswers[requirement_id] || {});

  // 1. 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || {};
    if (JSON.stringify(globalValue) !== JSON.stringify(data)) {
      setData(globalValue);
    }
  }, [currentAnswers, requirement_id]);

  // 2. 로컬 상태 -> 전역 상태 디바운스 업데이트
  useEffect(() => {
    const globalValue = currentAnswers[requirement_id] || {};
    if (JSON.stringify(data) === JSON.stringify(globalValue) || Object.keys(data).length === 0) {
      return;
    }

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving Scope3 for ${requirement_id}...`);
      updateCurrentAnswer(requirement_id, data);
    }, 800);

    return () => clearTimeout(handler);
  }, [data, requirement_id, currentAnswers, updateCurrentAnswer]);

  const lastClickTimeRef = useRef<Record<string, number>>({});
  
  const rows = input_schema?.rows || [];
  const columns = input_schema?.columns || [];

  const handleValueChange = (rowKey: string, entryIndex: number, path: string, value: any) => {
    setData(prevData => {
      const newEntries = [...(prevData[rowKey]?.entries || [])];
      // 중첩된 객체 경로에 값을 설정하는 로직
      const pathParts = path.split('.');
      let current = newEntries[entryIndex] || {};
      let temp = current;
      for (let i = 0; i < pathParts.length - 1; i++) {
        temp[pathParts[i]] = { ...temp[pathParts[i]] };
        temp = temp[pathParts[i]];
      }
      temp[pathParts[pathParts.length - 1]] = value;

      newEntries[entryIndex] = current;

      return { ...prevData, [rowKey]: { ...prevData[rowKey], entries: newEntries } };
    });
  };

  const handleAddEntry = (rowKey: string) => {
    const now = Date.now();
    if (now - (lastClickTimeRef.current[rowKey] || 0) < 500) return;
    lastClickTimeRef.current[rowKey] = now;

    setData(prevData => {
      const currentEntries = prevData[rowKey]?.entries || [];
      const newEntries = [...currentEntries, { id: `scope3_item_${Date.now()}` }];
      return { ...prevData, [rowKey]: { ...prevData[rowKey], entries: newEntries } };
    });
  };

  const handleRemoveEntry = (rowKey: string, entryIndex: number) => {
    const removeKey = `${rowKey}-${entryIndex}`;
    const now = Date.now();
    if (now - (lastClickTimeRef.current[removeKey] || 0) < 500) return;
    lastClickTimeRef.current[removeKey] = now;

    setData(prevData => {
      const currentEntries = prevData[rowKey]?.entries || [];
      if (currentEntries.length <= 1) return prevData;
      const newEntries = currentEntries.filter((_, index) => index !== entryIndex);
      return { ...prevData, [rowKey]: { ...prevData[rowKey], entries: newEntries } };
    });
  };

  const getValue = (rowKey: string, entryIndex: number, path: string): any => {
    // 중첩된 객체 경로에서 값을 가져오는 로직
    const pathParts = path.split('.');
    let current = data[rowKey]?.entries?.[entryIndex];
    for (const part of pathParts) {
      if (current === undefined || current === null) return '';
      current = current[part];
    }
    return current ?? '';
  };
  
  const flattenColumns = (cols: any[], parentPath: string = ''): any[] => {
    return cols.reduce((acc, col) => {
      const currentPath = parentPath ? `${parentPath}.${col.key}` : col.key;
      if (col.sub_columns?.length > 0) {
        return [...acc, ...flattenColumns(col.sub_columns, currentPath)];
      }
      return [...acc, { ...col, path: currentPath }];
    }, []);
  };

  const flatColumns = flattenColumns(columns);

  useEffect(() => {
    if (rows.length > 0) {
      setData(prevData => {
        let needsUpdate = false;
        const newData = { ...prevData };
        rows.forEach((row: any) => {
          if (!newData[row.key] || !Array.isArray(newData[row.key]?.entries) || newData[row.key].entries.length === 0) {
            newData[row.key] = { entries: [{ id: `scope3_item_${Date.now()}` }] };
            needsUpdate = true;
          }
        });
        return needsUpdate ? newData : prevData;
      });
    }
  }, [rows]);

  return (
    <div className="mt-2">
      <div className="space-y-8">
        {rows.map((row: any) => {
          const entries = data[row.key]?.entries || [{}];
          
          return (
            <div key={row.key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{row.label}</h4>
                <button
                  type="button"
                  onClick={() => handleAddEntry(row.key)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + 행 추가
                </button>
              </div>
              
              <div className="space-y-4">
                {entries.map((entry: any, entryIndex: number) => (
                  <div key={entry.id || entryIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">항목 {entryIndex + 1}</span>
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEntry(row.key, entryIndex)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {flatColumns.map((col) => (
                        <div key={col.path} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">{col.label}</label>
                          {col.isTextarea ? (
                            <TextareaAutosize
                              minRows={3}
                              maxRows={6}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              value={getValue(row.key, entryIndex, col.path)}
                              onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              value={getValue(row.key, entryIndex, col.path)}
                              onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        * Scope 3 온실가스 배출량 산정 접근법에 대해 각 카테고리별로 구체적으로 작성해주세요.
      </div>
    </div>
  );
} 