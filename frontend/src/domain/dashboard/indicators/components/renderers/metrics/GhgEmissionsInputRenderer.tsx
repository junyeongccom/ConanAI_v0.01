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
  
  // 🔍 기본 디버깅 로그
  console.log('🚀 GhgEmissionsInputRenderer 렌더링 시작');
  console.log('📋 requirement:', requirement);
  console.log('📋 requirement_id:', requirement?.requirement_id);
  console.log('💾 currentAnswers:', currentAnswers);
  
  // 전역 상태에서 직접 데이터를 가져옴
  const currentData = currentAnswers[requirement.requirement_id] || [];
  console.log('💾 currentData for this requirement:', currentData);
  
  // 로컬 상태 대신 전역 상태에서 연도와 데이터 추출
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // input_schema에서 카테고리 목록 가져오기
  console.log('📋 requirement.input_schema:', requirement?.input_schema);
  const categories = requirement.input_schema?.categories || [];
  console.log('📋 카테고리 추출 결과:', categories);
  console.log('📋 categories 타입:', typeof categories, Array.isArray(categories));
  
  // Scope 3 하위 카테고리들 (C1~C15)
  const scope3Categories = categories.filter((cat: string) => {
    // 공백 포함해서 " C"로 시작하거나, 트림 후 "C"로 시작하는 카테고리들
    return cat.startsWith(' C') || cat.trim().startsWith('C');
  });
  
  // 디버깅: 어떤 카테고리들이 있는지 확인
  console.log('📋 전체 카테고리:', categories);
  console.log('📋 Scope 3 카테고리:', scope3Categories);
  
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

  // 초기 로드 시 한 번만 자동계산 수행
  React.useEffect(() => {
    if (Object.keys(data).length > 0 && scope3Categories.length > 0) {
      console.log('🔄 초기 로드 - 자동계산 수행');
      console.log('📊 현재 데이터:', data);
      console.log('📊 Scope 3 카테고리 개수:', scope3Categories.length);
    }
  }, [scope3Categories.length]); // scope3Categories가 설정된 후에만 실행

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
    
    console.log(`💡 값 변경: ${category} (${year}) = ${numValue}`);
    
    // 바로 전역 상태 업데이트 액션 호출 (자동계산 포함)
    saveToStore(newData, years);
  };

  // Scope 3 자동 계산 (현재 입력된 데이터 기준)
  const calculateScope3 = (year: string, currentDataState: Record<string, Record<string, number>>): number => {
    console.log(`🧮 Scope 3 계산 시작 (${year}):`);
    console.log('   - scope3Categories:', scope3Categories);
    
    const result = scope3Categories.reduce((sum: number, category: string) => {
      const value = currentDataState[category]?.[year] || 0;
      console.log(`   - ${category}: ${value}`);
      return sum + value;
    }, 0);
    
    console.log(`   ✅ Scope 3 총합 (${year}): ${result}`);
    return result;
  };

  // 합계 자동 계산 (현재 입력된 데이터 기준)
  const calculateTotal = (year: string, currentDataState: Record<string, Record<string, number>>): number => {
    const scope1 = currentDataState['Scope 1']?.[year] || 0;
    const scope2 = currentDataState['Scope 2']?.[year] || 0;
    const scope3 = calculateScope3(year, currentDataState);
    return scope1 + scope2 + scope3;
  };

  // Tidy Data 형식으로 변환하여 저장
  const saveToStore = (currentData: Record<string, Record<string, number>>, currentYears: string[]) => {
    const tidyData: Array<{ category: string; year: string; value: number }> = [];
    
    console.log('🔄 saveToStore 호출 - currentData:', currentData);
    console.log('🔄 scope3Categories:', scope3Categories);
    
    categories.forEach((category: string) => {
      currentYears.forEach((year: string) => {
        let value = 0;
        
        if (category === 'Scope 3') {
          value = calculateScope3(year, currentData);
          console.log(`🧮 Scope 3 계산 (${year}): ${value}`);
        } else if (category === '합계') {
          value = calculateTotal(year, currentData);
          console.log(`🧮 합계 계산 (${year}): ${value}`);
        } else {
          value = currentData[category]?.[year] || 0;
        }
        
        tidyData.push({ category, year, value });
      });
    });
    
    console.log('💾 tidyData 저장:', tidyData);
    updateCurrentAnswer(requirement.requirement_id, tidyData);
  };

  console.log('🎨 컴포넌트 렌더링 준비 완료');
  console.log('🎨 최종 years:', years);
  console.log('🎨 최종 data:', data);
  console.log('🎨 최종 categories:', categories);
  
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
                  <td className={`px-3 py-2 font-medium text-sm border-r border-gray-300 ${
                    category.startsWith(' ') ? 'text-gray-700' : 'text-gray-900'
                  }`} style={{ whiteSpace: 'pre' }}>
                    {category}
                  </td>
                  {years.map((year) => {
                    let displayValue = '';
                    
                    if (isScope3) {
                      const calculatedValue = calculateScope3(year, data);
                      displayValue = calculatedValue.toLocaleString();
                      console.log(`🖥️ Scope 3 화면 표시 (${year}): ${calculatedValue} -> ${displayValue}`);
                    } else if (isTotal) {
                      const calculatedValue = calculateTotal(year, data);
                      displayValue = calculatedValue.toLocaleString();
                      console.log(`🖥️ 합계 화면 표시 (${year}): ${calculatedValue} -> ${displayValue}`);
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