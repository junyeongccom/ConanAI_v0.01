'use client';

import React, { useRef, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

interface GhgScope3ApproachInputRendererProps {
  requirement: any;
}

export function GhgScope3ApproachInputRenderer({ requirement }: GhgScope3ApproachInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || {};
  
  const lastClickTimeRef = useRef<Record<string, number>>({});
  
  // input_schema에서 행과 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const columns = requirement.input_schema?.columns || [];

  // 값 변경 핸들러
  const handleValueChange = (rowKey: string, entryIndex: number, path: string, value: string) => {
    const currentEntries = currentData[rowKey]?.entries || [];
    const currentEntry = currentEntries[entryIndex] || {};
    
    // 중첩된 경로로 값 설정 (불변성 보장)
    const pathArray = path.split('.');
    const updatedEntry = { ...currentEntry };
    
    // 중첩된 객체 구조를 불변성을 유지하며 업데이트
    let current = updatedEntry;
    for (let i = 0; i < pathArray.length - 1; i++) {
      const key = pathArray[i];
      current[key] = { ...current[key] };
      current = current[key];
    }
    current[pathArray[pathArray.length - 1]] = value;
    
    // 새로운 entries 배열 생성
    const newEntries = [...currentEntries];
    newEntries[entryIndex] = updatedEntry;
    
    // 완전한 불변성을 보장하는 새로운 객체 생성
    const newData = {
      ...currentData,
      [rowKey]: {
        ...currentData[rowKey],
        entries: newEntries
      }
    };
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newData);
  };

  // 행 추가 핸들러
  const handleAddEntry = (e: React.MouseEvent, rowKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 중복 클릭 방지 (500ms 내 같은 키에 대한 클릭 무시)
    const now = Date.now();
    const lastClickTime = lastClickTimeRef.current[rowKey] || 0;
    if (now - lastClickTime < 500) {
      return;
    }
    lastClickTimeRef.current[rowKey] = now;
    
    const currentEntries = currentData[rowKey]?.entries || [];
    
    // 완전한 불변성을 보장하는 새로운 객체 생성
    const newData = {
      ...currentData,
      [rowKey]: {
        ...currentData[rowKey],
        entries: [...currentEntries, {}] // 기존 배열을 복사하고 새 항목 추가
      }
    };
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newData);
  };

  // 행 삭제 핸들러
  const handleRemoveEntry = (e: React.MouseEvent, rowKey: string, entryIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 중복 클릭 방지
    const removeKey = `${rowKey}-${entryIndex}`;
    const now = Date.now();
    const lastClickTime = lastClickTimeRef.current[removeKey] || 0;
    if (now - lastClickTime < 500) {
      return;
    }
    lastClickTimeRef.current[removeKey] = now;
    
    const currentEntries = currentData[rowKey]?.entries || [];
    
    // 최소 1개 항목은 유지
    if (currentEntries.length <= 1) {
      return;
    }
    
    // 완전한 불변성을 보장하는 새로운 객체 생성
    const newData = {
      ...currentData,
      [rowKey]: {
        ...currentData[rowKey],
        entries: currentEntries.filter((_, index) => index !== entryIndex) // 새로운 배열 생성
      }
    };
    
    // 바로 전역 상태 업데이트 액션 호출
    updateCurrentAnswer(requirement.requirement_id, newData);
  };

  // 값 가져오기
  const getValue = (rowKey: string, entryIndex: number, path: string): string => {
    if (!currentData[rowKey] || !currentData[rowKey].entries || !currentData[rowKey].entries[entryIndex]) {
      return '';
    }
    
    const pathArray = path.split('.');
    let current = currentData[rowKey].entries[entryIndex];
    
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

  // 초기 데이터 구조 확인 및 생성
  useEffect(() => {
    if (rows.length > 0) {
      let needsUpdate = false;
      const newData = { ...currentData };
      
      rows.forEach((row: any) => {
        if (!newData[row.key] || !Array.isArray(newData[row.key]?.entries)) {
          newData[row.key] = { entries: [{}] };
          needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        updateCurrentAnswer(requirement.requirement_id, newData);
      }
    }
  }, [rows, currentData, requirement.requirement_id, updateCurrentAnswer]);

  return (
    <div className="mt-2">
      <div className="space-y-8">
        {rows.map((row: any) => {
          const entries = currentData[row.key]?.entries || [{}];
          
          return (
            <div key={row.key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{row.label}</h4>
                <button
                  type="button"
                  onClick={(e) => handleAddEntry(e, row.key)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  + 행 추가
                </button>
              </div>
              
              <div className="space-y-4">
                {entries.map((_, entryIndex: number) => (
                  <div key={entryIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        항목 {entryIndex + 1}
                      </span>
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveEntry(e, row.key, entryIndex)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {flatColumns.map((col) => (
                        <div key={col.path} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            {col.label}
                          </label>
                          {col.isTextarea ? (
                            <TextareaAutosize
                              minRows={3}
                              maxRows={6}
                              className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={getValue(row.key, entryIndex, col.path)}
                              onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                              placeholder="상세 내용을 입력하세요"
                            />
                          ) : (
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={getValue(row.key, entryIndex, col.path)}
                              onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                              placeholder="입력하세요"
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