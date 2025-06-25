'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAnswerStore } from '../../../stores/answerStore';

interface GhgScope3ApproachInputRendererProps {
  requirement: any;
}

export function GhgScope3ApproachInputRenderer({ requirement }: GhgScope3ApproachInputRendererProps) {
  const { answers, setAnswer } = useAnswerStore();
  const currentAnswer = answers[requirement.requirement_id];
  
  const [data, setData] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const lastClickTimeRef = useRef<Record<string, number>>({});
  
  // input_schema에서 행과 컬럼 정보 가져오기
  const rows = requirement.input_schema?.rows || [];
  const columns = requirement.input_schema?.columns || [];
  
  // 저장 함수
  const saveData = useCallback((newData: Record<string, any>) => {
    console.log('Saving data:', newData); // 디버깅용
    setAnswer(requirement.requirement_id, newData);
  }, [requirement.requirement_id, setAnswer]);
  
  useEffect(() => {
    // 이미 초기화되었으면 실행하지 않음
    if (isInitialized) {
      console.log('Already initialized, skipping useEffect');
      return;
    }
    
    console.log('useEffect triggered, currentAnswer:', currentAnswer); // 디버깅용
    console.log('rows:', rows); // 디버깅용
    
    if (rows.length === 0) {
      console.log('No rows available, skipping initialization');
      return;
    }
    
    // 저장된 답변이 있으면 복원
    if (currentAnswer && typeof currentAnswer === 'object' && Object.keys(currentAnswer).length > 0) {
      console.log('Restoring existing answer:', currentAnswer); // 디버깅용
      
      // 기존 데이터가 새로운 entries 형식인지 확인
      const hasEntriesFormat = Object.values(currentAnswer).some((value: any) => 
        value && typeof value === 'object' && Array.isArray(value.entries)
      );
      
      console.log('Has entries format:', hasEntriesFormat); // 디버깅용
      
      if (hasEntriesFormat) {
        setData(currentAnswer);
      } else {
        // 기존 형식을 새로운 entries 형식으로 변환
        const convertedData: Record<string, any> = {};
        rows.forEach((row: any) => {
          if (currentAnswer[row.key]) {
            convertedData[row.key] = { entries: [currentAnswer[row.key]] };
          } else {
            convertedData[row.key] = { entries: [{}] };
          }
        });
        console.log('Converted data:', convertedData); // 디버깅용
        setData(convertedData);
      }
    } else {
      console.log('Initializing data for rows:', rows); // 디버깅용
      // 초기화: 각 카테고리별로 기본 행 하나씩 생성
      const initialData: Record<string, any> = {};
      rows.forEach((row: any) => {
        initialData[row.key] = { entries: [{}] }; // entries 배열로 각 카테고리의 여러 행을 관리
      });
      console.log('Initial data:', initialData); // 디버깅용
      setData(initialData);
    }
    
    setIsInitialized(true);
  }, [currentAnswer, rows, isInitialized]); // isInitialized 추가

  // 값 변경 핸들러
  const handleValueChange = useCallback((rowKey: string, entryIndex: number, path: string, value: string) => {
    console.log('Value change:', { rowKey, entryIndex, path, value }); // 디버깅용
    
    setData(prevData => {
      const currentEntries = prevData[rowKey]?.entries || [];
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
        ...prevData,
        [rowKey]: {
          ...prevData[rowKey],
          entries: newEntries
        }
      };
      
      console.log('New data after value change:', newData); // 디버깅용
      return newData;
    });
  }, []);

  // 행 추가 핸들러
  const handleAddEntry = useCallback((e: React.MouseEvent, rowKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 중복 클릭 방지 (500ms 내 같은 키에 대한 클릭 무시)
    const now = Date.now();
    const lastClickTime = lastClickTimeRef.current[rowKey] || 0;
    if (now - lastClickTime < 500) {
      console.log('Debounced click, ignoring');
      return;
    }
    lastClickTimeRef.current[rowKey] = now;
    
    console.log('Adding entry for:', rowKey); // 디버깅용
    
    setData(prevData => {
      console.log('Previous data in setData:', prevData); // 디버깅용
      
      // 현재 entries 길이를 기록
      const currentEntries = prevData[rowKey]?.entries || [];
      const currentLength = currentEntries.length;
      console.log('Current entries length:', currentLength); // 디버깅용
      
      // 완전한 불변성을 보장하는 새로운 객체 생성
      const newData = {
        ...prevData,
        [rowKey]: {
          ...prevData[rowKey],
          entries: [...currentEntries, {}] // 기존 배열을 복사하고 새 항목 추가
        }
      };
      
      const newLength = newData[rowKey].entries.length;
      console.log('New entries length:', newLength); // 디버깅용
      console.log('Added entries count:', newLength - currentLength); // 디버깅용
      
      return newData;
    });
  }, []); // 의존성 배열에서 data 제거

  // 행 삭제 핸들러
  const handleRemoveEntry = useCallback((e: React.MouseEvent, rowKey: string, entryIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 중복 클릭 방지
    const removeKey = `${rowKey}-${entryIndex}`;
    const now = Date.now();
    const lastClickTime = lastClickTimeRef.current[removeKey] || 0;
    if (now - lastClickTime < 500) {
      console.log('Debounced click, ignoring');
      return;
    }
    lastClickTimeRef.current[removeKey] = now;
    
    console.log('Removing entry:', { rowKey, entryIndex }); // 디버깅용
    
    setData(prevData => {
      const currentEntries = prevData[rowKey]?.entries || [];
      
      // 최소 1개 항목은 유지
      if (currentEntries.length <= 1) {
        console.log('Cannot remove last entry, keeping at least one'); // 디버깅용
        return prevData; // 변경 없이 기존 상태 반환
      }
      
      const beforeLength = currentEntries.length;
      
      // 완전한 불변성을 보장하는 새로운 객체 생성
      const newData = {
        ...prevData,
        [rowKey]: {
          ...prevData[rowKey],
          entries: currentEntries.filter((_, index) => index !== entryIndex) // 새로운 배열 생성
        }
      };
      
      const afterLength = newData[rowKey].entries.length;
      console.log('Removed entries count:', beforeLength - afterLength); // 디버깅용
      console.log('New data after removing entry:', newData); // 디버깅용
      
      return newData;
    });
  }, []);

  // 값 가져오기 (함수형 업데이트가 아니므로 data 의존성 유지)
  const getValue = useCallback((rowKey: string, entryIndex: number, path: string): string => {
    if (!data[rowKey] || !data[rowKey].entries || !data[rowKey].entries[entryIndex]) {
      return '';
    }
    
    const pathArray = path.split('.');
    let current = data[rowKey].entries[entryIndex];
    
    for (const key of pathArray) {
      if (!current || typeof current !== 'object') return '';
      current = current[key];
    }
    
    return current || '';
  }, [data]); // getValue는 현재 data를 읽어야 하므로 의존성 유지

  // 데이터가 변경될 때마다 저장 (렌더링과 분리)
  useEffect(() => {
    // 초기화가 완료되지 않았으면 저장하지 않음
    if (!isInitialized) {
      console.log('Not initialized yet, skipping auto-save');
      return;
    }
    
    console.log('Data changed, current data:', data); // 디버깅용
    
    if (Object.keys(data).length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-saving data:', data); // 디버깅용
        saveData(data);
      }, 500); // 500ms로 증가
      
      return () => {
        console.log('Clearing timeout'); // 디버깅용
        clearTimeout(timeoutId);
      };
    }
  }, [data, saveData, isInitialized]); // isInitialized 추가

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
                Scope 3 카테고리
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100" rowSpan={3}>
                관리
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
            {rows.map((row: any) => {
              const entries = data[row.key]?.entries || [{}];
              
              return entries.map((entry: any, entryIndex: number) => (
                <tr key={`${row.key}-${entryIndex}`}>
                  {entryIndex === 0 && (
                    <td 
                      className="px-2 py-2 font-medium text-sm border border-gray-300 bg-gray-50 max-w-xs"
                      rowSpan={entries.length}
                    >
                      <div className="font-medium">{row.label}</div>
                    </td>
                  )}
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        type="button"
                        onClick={(e) => handleAddEntry(e, row.key)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="행 추가"
                      >
                        +
                      </button>
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveEntry(e, row.key, entryIndex)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          title="행 삭제"
                        >
                          -
                        </button>
                      )}
                    </div>
                  </td>
                  {flatColumns.map((flatCol, colIndex) => (
                    <td key={colIndex} className="px-2 py-2 border border-gray-300">
                      {flatCol.isTextarea ? (
                        <TextareaAutosize
                          minRows={2}
                          maxRows={6}
                          className="w-full p-1 border border-gray-200 rounded text-sm resize-none"
                          value={getValue(row.key, entryIndex, flatCol.path)}
                          onChange={(e) => handleValueChange(row.key, entryIndex, flatCol.path, e.target.value)}
                          placeholder="주요 가정을 입력하세요"
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-200 rounded text-sm"
                          value={getValue(row.key, entryIndex, flatCol.path)}
                          onChange={(e) => handleValueChange(row.key, entryIndex, flatCol.path, e.target.value)}
                          placeholder="내용을 입력하세요"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        * Scope 3의 15개 카테고리별 온실가스 배출량 측정을 위해 적용한 접근법, 투입변수, 가정을 작성해주세요.
        <br />
        * 각 카테고리별로 + 버튼을 눌러 여러 항목을 추가할 수 있습니다.
      </div>
    </div>
  );
} 