'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import useAnswerStore from '@/shared/store/answerStore';
import { useDebouncedAnswer } from '@/shared/hooks/useDebouncedAnswer';
import { YearAddModal } from './YearAddModal';

interface GhgEmissionsInputRendererProps {
  requirement: any;
}

export function GhgEmissionsInputRenderer({ requirement }: GhgEmissionsInputRendererProps) {
  const { requirement_id, input_schema } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  
  const categories = input_schema?.categories || [];
  const scope3Categories = categories.filter((cat: string) => cat.trim().startsWith('C'));

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

  const [isModalOpen, setIsModalOpen] = useState(false);

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