'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';
import { YearAddModal } from './YearAddModal';

interface GhgEmissionsInputRendererProps {
  requirement: any;
}

export function GhgEmissionsInputRenderer({ requirement }: GhgEmissionsInputRendererProps) {
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || [];
  
  // 로컬 상태 대신 전역 상태에서 연도와 데이터 추출
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // input_schema에서 카테고리 목록 가져오기
  const categories = requirement.input_schema?.categories || [];
  
  // Scope 3 하위 카테고리들 (C1~C15)
  const scope3Categories = categories.filter((cat: string) => cat.startsWith(' C'));
  
  // 전역 상태에서 연도와 데이터 추출
  const extractYearsAndData = () => {
    const restoredData: Record<string, Record<string, number>> = {};
    const restoredYears = new Set<string>();
    
    if (Array.isArray(currentData)) {
      currentData.forEach((item: any) => {
        if (item.category && item.year && item.value !== undefined) {
          if (!restoredData[item.category]) {
            restoredData[item.category] = {};
          }
          restoredData[item.category][item.year] = parseFloat(item.value) || 0;
          restoredYears.add(item.year);
        }
      });
    }
    
    return {
      years: restoredYears.size > 0 ? Array.from(restoredYears).sort() : ['2023'],
      data: restoredData
    };
  };
  
  const { years, data } = extractYearsAndData();

  // 연도 추가
  const addYear = (newYear: string) => {
    const newYears = [...years, newYear].sort();
    saveToStore(data, newYears);
  };

  // 연도 삭제
  const removeYear = (yearToRemove: string) => {
    if (years.length <= 1) return;
    
    const newYears = years.filter(year => year !== yearToRemove);
    const newData = { ...data };
    Object.keys(newData).forEach(category => {
      delete newData[category][yearToRemove];
    });
    saveToStore(newData, newYears);
  };

  // 값 변경 핸들러
  const handleValueChange = (category: string, year: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newData = {
      ...data,
      [category]: {
        ...data[category],
        [year]: numValue
      }
    };
    
    // 바로 전역 상태 업데이트 액션 호출
    saveToStore(newData, years);
  };

  // Scope 3 자동 계산
  const calculateScope3 = (year: string): number => {
    return scope3Categories.reduce((sum: number, category: string) => {
      return sum + (data[category]?.[year] || 0);
    }, 0);
  };

  // 합계 자동 계산
  const calculateTotal = (year: string): number => {
    const scope1 = data['Scope 1']?.[year] || 0;
    const scope2 = data['Scope 2']?.[year] || 0;
    const scope3 = calculateScope3(year);
    return scope1 + scope2 + scope3;
  };

  // Tidy Data 형식으로 변환하여 저장
  const saveToStore = (currentData: Record<string, Record<string, number>>, currentYears: string[]) => {
    const tidyData: Array<{ category: string; year: string; value: number }> = [];
    
    categories.forEach((category: string) => {
      currentYears.forEach((year: string) => {
        let value = 0;
        
        if (category === 'Scope 3') {
          value = calculateScope3(year);
        } else if (category === '합계') {
          value = calculateTotal(year);
        } else {
          value = currentData[category]?.[year] || 0;
        }
        
        tidyData.push({ category, year, value });
      });
    });
    
    updateCurrentAnswer(requirement.requirement_id, tidyData);
  };

  return (
    <div className="mt-2">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={16} /> 연도 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                배출 구분
              </th>
              {years.map((year) => (
                <th key={year} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 relative">
                  {year}
                  {years.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeYear(year)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category: string) => {
              const isScope3 = category === 'Scope 3';
              const isTotal = category === '합계';
              const isCalculated = isScope3 || isTotal;
              
              return (
                <tr key={category} className={isCalculated ? 'bg-gray-50' : ''}>
                  <td className="px-3 py-2 font-medium text-sm border-r border-gray-300">
                    {category}
                  </td>
                  {years.map((year) => {
                    let displayValue = '';
                    
                    if (isScope3) {
                      displayValue = calculateScope3(year).toLocaleString();
                    } else if (isTotal) {
                      displayValue = calculateTotal(year).toLocaleString();
                    } else {
                      displayValue = (data[category]?.[year] || '').toString();
                    }
                    
                    return (
                      <td key={year} className="px-3 py-2 border-r border-gray-300">
                        <input
                          type="number"
                          className={`w-full p-1 border rounded text-sm text-center ${
                            isCalculated 
                              ? 'bg-gray-100 border-gray-200 text-gray-600' 
                              : 'border-gray-300'
                          }`}
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

      <YearAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addYear}
        existingYears={years}
      />
    </div>
  );
} 