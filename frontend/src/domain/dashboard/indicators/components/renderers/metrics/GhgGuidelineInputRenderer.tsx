'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useAnswerStore from '@/shared/store/answerStore';
import { useDebouncedAnswer } from '@/shared/hooks/useDebouncedAnswer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

interface GhgGuidelineInputRendererProps {
  requirement: any;
}

export function GhgGuidelineInputRenderer({ requirement }: GhgGuidelineInputRendererProps) {
  const { requirement_id } = requirement;
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  const debouncedSave = useDebouncedAnswer(requirement_id, updateCurrentAnswer);

  const scopes = ['Scope 1', 'Scope 2', 'Scope 3'];

  const [guidelines, setGuidelines] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    const answer = currentAnswers[requirement_id];

    if (Array.isArray(answer)) {
      // 기존 "Scope 1, 2" 데이터를 찾아서 "Scope 1"과 "Scope 2"에 모두 할당
      const scope12Item = answer.find(item => item.scope === 'Scope 1, 2');
      if (scope12Item) {
        initialData['Scope 1'] = scope12Item.guideline || '';
        initialData['Scope 2'] = scope12Item.guideline || '';
      }

      // 개별 Scope 데이터가 있으면 덮어씀
      answer.forEach(item => {
        if (item.scope && scopes.includes(item.scope)) {
          initialData[item.scope] = item.guideline || '';
        }
      });
    }

    // 모든 scope에 대해 초기값 보장
    scopes.forEach(scope => {
      if (initialData[scope] === undefined) {
        initialData[scope] = '';
      }
    });

    return initialData;
  });

  useEffect(() => {
    const formattedForSave = scopes.map(scope => ({
      scope,
      guideline: guidelines[scope] || '',
    }));
    
    if (JSON.stringify(formattedForSave) !== JSON.stringify(currentAnswers[requirement_id])) {
        debouncedSave(formattedForSave);
    }
  }, [guidelines, scopes, debouncedSave, requirement_id, currentAnswers]);

  const handleValueChange = (scope: string, guideline: string) => {
    setGuidelines(prev => ({
      ...prev,
      [scope]: guideline,
    }));
  };

  return (
    <div className="mt-2">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 border-r">구분</TableHead>
            <TableHead>지침</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scopes.map(scope => (
            <TableRow key={scope}>
              <TableCell className="font-medium border-r align-top pt-3">{scope}</TableCell>
              <TableCell>
                <TextareaAutosize
                  minRows={3}
                  className="w-full p-2 text-sm resize-none border-0 focus:ring-0"
                  placeholder="적용된 산정 방법론, 기준, 지침 등을 서술해주세요."
                  value={guidelines[scope] || ''}
                  onChange={(e) => handleValueChange(scope, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-2 text-xs text-gray-500">
        * 각 Scope별로 적용한 온실가스 배출량 측정 지침을 상세히 작성해주세요.
      </div>
    </div>
  );
} 