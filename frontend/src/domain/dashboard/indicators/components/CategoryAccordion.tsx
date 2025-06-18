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
    <Accordion.Root type="multiple" className="space-y-3">
      {categoryNames.map((name) => (
        <Accordion.Item key={name} value={name} className="border border-gray-200 rounded-md">
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-700 hover:bg-gray-50 group transition-colors">
              <span className="text-sm font-semibold">{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {categories[name].length}개 항목
                </span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-gray-400" />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="border-t border-gray-200 bg-gray-50/30">
                {categories[name].map((item) => (
                  <IndicatorItem key={item.disclosure_id} item={item} />
                ))}
              </div>
            </motion.div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
} 