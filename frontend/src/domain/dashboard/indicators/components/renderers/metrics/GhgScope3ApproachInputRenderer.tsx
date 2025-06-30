'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';
import { Button } from '@/shared/components/ui/button';
import { Trash2 } from 'lucide-react';

interface GhgScope3ApproachInputRendererProps {
  requirement: any;
}

// 컬럼 구조를 재귀적으로 평탄화하는 헬퍼 함수
const flattenColumns = (columns: any[], parentPath: string = ''): Array<{ path: string; label: string; isTextarea?: boolean }> => {
  return columns.reduce((acc, col) => {
    const currentPath = parentPath ? `${parentPath}.${col.key}` : col.key;
    if (col.sub_columns && col.sub_columns.length > 0) {
      return [...acc, ...flattenColumns(col.sub_columns, currentPath)];
    }
    return [...acc, { path: currentPath, label: col.label, isTextarea: col.key === 'key_assumptions' }];
  }, []);
};

// 중첩된 헤더를 렌더링하는 컴포넌트
const TableHeader = ({ columns }: { columns: any[] }) => {
  const headerLevels: React.ReactNode[][] = [];

  const buildHeaderLevels = (cols: any[], level: number) => {
    if (!headerLevels[level]) {
      headerLevels[level] = [];
    }

    cols.forEach(col => {
      const colSpan = col.sub_columns ? flattenColumns(col.sub_columns).length : 1;
      const rowSpan = !col.sub_columns ? 99 : 1; // A large number to span all rows

      headerLevels[level].push(
        <th key={col.key} colSpan={colSpan} rowSpan={1} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">
          {col.label}
        </th>
      );

      if (col.sub_columns) {
        buildHeaderLevels(col.sub_columns, level + 1);
      } else {
        // Fill placeholder cells for alignment
        for (let i = level + 1; i < headerLevels.length; i++) {
          if (!headerLevels[i]) headerLevels[i] = [];
          headerLevels[i].push(...Array(colSpan).fill(<th key={`${col.key}_placeholder_${i}`} className="hidden"></th>));
        }
      }
    });
  };

  buildHeaderLevels(columns, 0);
  
  // This logic is complex, so we will simplify it for now
  // and focus on getting a working version. A proper dynamic header
  // might require a more sophisticated algorithm.

  const getSubColumnsCount = (column: any): number => {
    if (!column.sub_columns || column.sub_columns.length === 0) {
      return 1;
    }
    return column.sub_columns.reduce((acc: number, subCol: any) => acc + getSubColumnsCount(subCol), 0);
  };

  return (
    <thead>
      <tr>
        <th rowSpan={3} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">항목</th>
        {columns.map(col => (
          <th
            key={col.key}
            colSpan={getSubColumnsCount(col)}
            rowSpan={!col.sub_columns ? 3 : 1}
            className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100"
          >
            {col.label}
          </th>
        ))}
        <th rowSpan={3} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">삭제</th>
      </tr>
      <tr>
        {columns.filter(c => c.sub_columns).flatMap(col => col.sub_columns.map((subCol: any) => (
          <th
            key={subCol.key}
            colSpan={getSubColumnsCount(subCol)}
            rowSpan={!subCol.sub_columns ? 2 : 1}
            className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-50"
          >
            {subCol.label}
          </th>
        )))}
      </tr>
       <tr>
        {columns.filter(c => c.sub_columns).flatMap(col => col.sub_columns.filter((sc: any) => sc.sub_columns).flatMap((subCol: any) => subCol.sub_columns.map((ssCol:any) => (
          <th key={ssCol.key} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-white">
            {ssCol.label}
          </th>
        ))))}
      </tr>
    </thead>
  );
};

export function GhgScope3ApproachInputRenderer({ requirement }: GhgScope3ApproachInputRendererProps) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();

  const [data, setData] = useState(() => currentAnswers[requirement_id] || {});

  useEffect(() => {
    const globalValue = currentAnswers[requirement_id];
    if (globalValue && JSON.stringify(globalValue) !== JSON.stringify(data)) {
      setData(globalValue);
    }
  }, [currentAnswers, requirement_id]);
  
  const debouncedSave = useCallback(
    debounce((newData) => {
      updateCurrentAnswer(requirement_id, newData);
    }, 800),
    [requirement_id, updateCurrentAnswer]
  );
  
  useEffect(() => {
    debouncedSave(data);
    return () => debouncedSave.cancel();
  }, [data, debouncedSave]);

  const handleValueChange = (rowKey: string, entryIndex: number, path: string, value: any) => {
    setData(prevData => {
      const newEntries = [...(prevData[rowKey] || [])];
      const pathParts = path.split('.');
      let current = newEntries[entryIndex] || {};
      let temp = current;
      for (let i = 0; i < pathParts.length - 1; i++) {
        temp[pathParts[i]] = { ...temp[pathParts[i]] };
        temp = temp[pathParts[i]];
      }
      temp[pathParts[pathParts.length - 1]] = value;
      newEntries[entryIndex] = current;
      return { ...prevData, [rowKey]: newEntries };
    });
  };

  const handleAddEntry = (rowKey: string) => {
    setData(prevData => {
      const currentEntries = prevData[rowKey] || [];
      const newEntries = [...currentEntries, { id: `scope3_item_${Date.now()}` }];
      return { ...prevData, [rowKey]: newEntries };
    });
  };

  const handleRemoveEntry = (rowKey: string, entryIndex: number) => {
    setData(prevData => {
      const currentEntries = prevData[rowKey] || [];
      if (currentEntries.length <= 1) return prevData;
      const newEntries = currentEntries.filter((_, index) => index !== entryIndex);
      return { ...prevData, [rowKey]: newEntries };
    });
  };

  const getValue = (rowKey: string, entryIndex: number, path: string): any => {
    const pathParts = path.split('.');
    let current = data[rowKey]?.[entryIndex];
    for (const part of pathParts) {
      if (current === undefined || current === null) return '';
      current = current[part];
    }
    return current ?? '';
  };
  
  const flatColumns = flattenColumns(input_schema?.columns || []);

  useEffect(() => {
    if (input_schema?.rows) {
      setData(prevData => {
        let needsUpdate = false;
        const newData = { ...prevData };
        input_schema.rows.forEach((row: any) => {
          if (!Array.isArray(newData[row.key]) || newData[row.key].length === 0) {
            newData[row.key] = [{ id: `scope3_item_${Date.now()}` }];
            needsUpdate = true;
          }
        });
        return needsUpdate ? newData : prevData;
      });
    }
  }, [input_schema?.rows]);

  if (!input_schema) {
    return <div className="mt-2 text-sm text-red-500">입력 양식 스키마가 정의되지 않았습니다.</div>;
  }

  return (
    <div className="mt-2 space-y-8">
      {input_schema.rows.map((row: any) => (
        <div key={row.key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">{row.label}</h4>
            <Button onClick={() => handleAddEntry(row.key)}>+ 행 추가</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <TableHeader columns={input_schema.columns} />
              <tbody className="bg-white">
                {(data[row.key] || []).map((entry: any, entryIndex: number) => (
                  <tr key={entry.id || entryIndex}>
                    <td className="px-2 py-2 font-medium text-sm border border-gray-300 bg-gray-50 text-center">{entryIndex + 1}</td>
                    {flatColumns.map(col => (
                      <td key={col.path} className="px-2 py-2 border border-gray-300">
                        {col.isTextarea ? (
                          <TextareaAutosize
                            minRows={2}
                            className="w-full p-2 border-gray-200 rounded text-sm resize-none"
                            value={getValue(row.key, entryIndex, col.path)}
                            onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="w-full p-2 border-gray-200 rounded text-sm"
                            value={getValue(row.key, entryIndex, col.path)}
                            onChange={(e) => handleValueChange(row.key, entryIndex, col.path, e.target.value)}
                          />
                        )}
                      </td>
                    ))}
                     <td className="px-2 py-2 border border-gray-300 text-center">
                      {(data[row.key] || []).length > 1 && (
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveEntry(row.key, entryIndex)}>
                           <Trash2 className="h-4 w-4 text-red-500" />
                         </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
  return debounced as T & { cancel: () => void };
} 