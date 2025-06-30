'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';
import { useDebouncedAnswer } from '@/shared/hooks/useDebouncedAnswer';
import { YearAddModal } from './YearAddModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

interface GhgEmissionsInputRendererProps {
  requirement: any;
}

// "온실가스 배출량 산정 지침"을 렌더링하는 컴포넌트
function GuidelineRenderer({ requirement }: { requirement: any }) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  const debouncedSave = useDebouncedAnswer(requirement_id, updateCurrentAnswer);

  const schemaRows = input_schema?.rows || [];
  const valueColumn = input_schema?.value_column || {};

  const [rows, setRows] = useState(() => {
    const answer = currentAnswers[requirement_id];
    if (Array.isArray(answer) && answer.length > 0) {
      const answerMap = new Map(answer.map(item => [item.scope, item]));
      return schemaRows.map((schemaRow: any) => 
        answerMap.get(schemaRow.label) || { scope: schemaRow.label, guideline: '' }
      );
    }
    return schemaRows.map((row: any) => ({ scope: row.label, guideline: '' }));
  });

  useEffect(() => {
    if (JSON.stringify(rows) !== JSON.stringify(currentAnswers[requirement_id])) {
      debouncedSave(rows);
    }
  }, [rows, debouncedSave, currentAnswers, requirement_id]);

  const handleValueChange = (scope: string, guideline: string) => {
    setRows(prevRows =>
      prevRows.map(row => (row.scope === scope ? { ...row, guideline } : row))
    );
  };

  return (
    <div className="mt-2">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 border-r">구분</TableHead>
            <TableHead>{valueColumn.label || '지침'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.scope}>
              <TableCell className="font-medium border-r align-top pt-3">{row.scope}</TableCell>
              <TableCell>
                <TextareaAutosize
                  minRows={3}
                  className="w-full p-2 text-sm resize-none border-0 focus:ring-0"
                  placeholder={valueColumn.placeholder || '내용을 입력해주세요.'}
                  value={row.guideline || ''}
                  onChange={(e) => handleValueChange(row.scope, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


// "온실가스 총 배출량"을 렌더링하는 컴포넌트
function EmissionsRenderer({ requirement }: { requirement: any }) {
    const { requirement_id, input_schema } = requirement;
    const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  
    const categories = input_schema?.categories || [];
    const scope3Categories = categories.filter((cat: string) => cat.trim().startsWith('C'));
  
    const [years, setYears] = useState<string[]>(() => {
      const restoredYears = new Set<string>();
      const answer = currentAnswers[requirement_id];
      if (Array.isArray(answer)) {
        answer.forEach((item: any) => {
          if (item.year) restoredYears.add(item.year.toString());
        });
      }
      return restoredYears.size > 0 ? Array.from(restoredYears).sort() : ['2023'];
    });
  
    const [data, setData] = useState<Record<string, Record<string, number | null>>>(() => {
      const restoredData: Record<string, Record<string, number | null>> = {};
      const answer = currentAnswers[requirement_id];
      if (Array.isArray(answer)) {
        answer.forEach((item: any) => {
          if (item.category && item.year) {
            if (!restoredData[item.category]) restoredData[item.category] = {};
            restoredData[item.category][item.year] = (item.value === 0 || item.value) ? Number(item.value) : null;
          }
        });
      }
      return restoredData;
    });
  
    const debouncedSave = useDebouncedAnswer(requirement_id, updateCurrentAnswer);
  
    useEffect(() => {
      const tidyData: any[] = [];
      categories.forEach((category: string) => {
        years.forEach((year: string) => {
          let value;
          if (category === 'Scope 3') {
            value = scope3Categories.reduce((sum, cat) => sum + (Number(data[cat]?.[year]) || 0), 0);
          } else if (category === '합계') {
            const scope3Total = scope3Categories.reduce((sum, cat) => sum + (Number(data[cat]?.[year]) || 0), 0);
            value = (Number(data['Scope 1']?.[year]) || 0) + (Number(data['Scope 2']?.[year]) || 0) + scope3Total;
          } else {
            value = data[category]?.[year] ?? null;
          }
          tidyData.push({ category, year, value });
        });
      });
  
      if (JSON.stringify(tidyData) !== JSON.stringify(currentAnswers[requirement_id])) {
        debouncedSave(tidyData);
      }
    }, [data, years, categories, scope3Categories, currentAnswers, requirement_id, debouncedSave]);
  
  
    const handleValueChange = (category: string, year: string, value: string) => {
      const numValue = value === '' ? null : parseFloat(value);
      setData(prevData => ({
        ...prevData,
        [category]: { ...prevData[category], [year]: numValue }
      }));
    };
    
    const getDisplayValue = (category: string, year: string): string => {
      const value = data[category]?.[year];
      return value === null || value === undefined ? '' : String(value);
    };
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addYear = (newYear: string) => {
      if (!years.includes(newYear)) {
        setYears(prev => [...prev, newYear].sort());
      }
      setIsModalOpen(false);
    };
  
    const removeYear = (yearToRemove: string) => {
      if (years.length <= 1) return;
      setYears(prev => prev.filter(y => y !== yearToRemove));
      setData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(cat => {
          delete newData[cat][yearToRemove];
        });
        return newData;
      });
    };

    return (
        <div className="mt-2">
            <div className="mb-4 flex items-center gap-2">
            <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                <PlusCircle size={16} /> 연도 추가
            </button>
            </div>
    
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">배출 구분</th>
                    {years.map((year) => (
                    <th key={year} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r relative">
                        {year}
                        {years.length > 1 && (
                        <button type="button" onClick={() => removeYear(year)} className="absolute top-1 right-1 text-red-500 hover:text-red-700">
                            <Trash2 size={12} />
                        </button>
                        )}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category: string) => {
                    const isCalculated = category === 'Scope 3' || category === '합계';
                    return (
                    <tr key={category} className={isCalculated ? 'bg-gray-50' : ''}>
                        <td className={`px-3 py-2 font-medium text-sm border-r ${category.trim().startsWith('C') ? 'pl-6 text-gray-700' : 'text-gray-900'}`} style={{ whiteSpace: 'pre' }}>
                        {category}
                        </td>
                        {years.map((year) => {
                        let displayValue;
                        if (category === 'Scope 3') {
                            displayValue = scope3Categories.reduce((sum, cat) => sum + (Number(data[cat]?.[year]) || 0), 0);
                        } else if (category === '합계') {
                            const scope3Total = scope3Categories.reduce((sum, cat) => sum + (Number(data[cat]?.[year]) || 0), 0);
                            displayValue = (Number(data['Scope 1']?.[year]) || 0) + (Number(data['Scope 2']?.[year]) || 0) + scope3Total;
                        } else {
                            displayValue = getDisplayValue(category, year);
                        }
                        
                        return (
                            <td key={year} className="px-3 py-2 border-r">
                            <input
                                type="number"
                                className={`w-full p-1 border rounded text-sm text-right ${isCalculated ? 'bg-gray-100 border-gray-200 text-gray-600 font-semibold' : 'border-gray-300'}`}
                                value={displayValue}
                                disabled={isCalculated}
                                onChange={(e) => handleValueChange(category, year, e.target.value)}
                                placeholder={isCalculated ? '자동계산' : '0'}
                            />
                            </td>
                        );
                        })}
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
            * 단위: tCO2e (이산화탄소 환산톤)
            * Scope 3와 합계는 자동으로 계산됩니다.
            </div>
    
            <YearAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addYear} existingYears={years} />
        </div>
    );
}

export function GhgEmissionsInputRenderer({ requirement }: GhgEmissionsInputRendererProps) {
  const { input_schema } = requirement;

  // input_schema 구조에 따라 다른 렌더러를 반환
  if (input_schema?.rows && input_schema?.value_column) {
    // "산정 지침" UI
    return <GuidelineRenderer requirement={requirement} />;
  } else if (input_schema?.categories) {
    // "총 배출량" UI
    return <EmissionsRenderer requirement={requirement} />;
  }

  // 적절한 스키마가 없는 경우 폴백 UI
  return <div className="mt-2 text-sm text-red-500">이 항목에 대한 입력 양식을 표시할 수 없습니다.</div>;
} 