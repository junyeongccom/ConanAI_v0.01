'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CategoryAccordionProps } from '../types';
import { IndicatorItem } from './IndicatorItem';

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const categoryNames = Object.keys(categories);

  if (categoryNames.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        해당 섹션에 공시 지표가 없습니다.
      </div>
    );
  }

  return (
    <Accordion.Root type="multiple" className="space-y-2">
      {categoryNames.map((name) => (
        <Accordion.Item key={name} value={name} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 group transition-colors duration-150">
              <span>{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                  {categories[name].length}개 항목
                </span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-gray-400" />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            {categories[name].map((item) => (
              <IndicatorItem key={item.disclosure_id} item={item} />
            ))}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
} 