'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { IndicatorTabsProps } from '../types';
import { CategoryAccordion } from './CategoryAccordion';

export function IndicatorTabs({ data }: IndicatorTabsProps) {
  const sections = Object.keys(data);

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-lg font-medium mb-2">공시 지표 데이터가 없습니다</div>
        <div className="text-sm">데이터를 불러오는 중이거나 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <Tabs.Root defaultValue={sections[0]} className="flex flex-col w-full">
      <Tabs.List className="flex border-b border-gray-200">
        {sections.map((section) => {
          const categoryCount = Object.keys(data[section]).length;
          const totalItems = Object.values(data[section]).reduce((sum, items) => sum + items.length, 0);
          
          return (
            <Tabs.Trigger
              key={section}
              value={section}
              className="px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent -mb-px data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 hover:text-gray-700 transition-colors whitespace-nowrap flex flex-col items-center gap-1"
            >
              <span>{section}</span>
              <span className="text-xs text-gray-400 font-normal">
                {categoryCount}개 카테고리 · {totalItems}개 항목
              </span>
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      
      {sections.map((section) => (
        <Tabs.Content key={section} value={section} className="py-6 focus:outline-none">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{section}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {Object.keys(data[section]).length}개의 카테고리에서 총 {' '}
              {Object.values(data[section]).reduce((sum, items) => sum + items.length, 0)}개의 공시 지표를 관리할 수 있습니다.
            </p>
          </div>
          <CategoryAccordion categories={data[section]} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
} 