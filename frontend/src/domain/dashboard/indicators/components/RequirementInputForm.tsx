'use client';

import { useEffect, useCallback } from 'react';
import { RequirementData } from '../types';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';
import { FieldRenderer } from './renderers/FieldRenderer';

interface RequirementInputFormProps {
  requirements: RequirementData[];
}

/**
 * 요구사항 배열을 받아 동적으로 입력 폼을 생성하는 컴포넌트입니다.
 * 이제 모든 렌더링은 FieldRenderer를 통해 처리됩니다.
 */
export function RequirementInputForm({ requirements }: RequirementInputFormProps) {
  // 스토어의 상태와 액션을 가져옵니다.
  const { currentAnswers } = useAnswers();
  const updateCurrentAnswer = useAnswerStore((state) => state.updateCurrentAnswer);

  // 디버깅: 컴포넌트 마운트 시 스토어 상태 확인
  useEffect(() => {
    console.log('🔍 RequirementInputForm 마운트됨');
    console.log('📦 현재 스토어 상태:', currentAnswers);
    console.log('🗄️ localStorage 확인:', localStorage.getItem('skyc-unsaved-answers'));
  }, []);

  // 디버깅: answers 상태 변경 감지
  useEffect(() => {
    console.log('📝 답변 상태 변경됨:', currentAnswers);
  }, [currentAnswers]);

  // 요구사항이 없는 경우를 위한 UI 처리
  if (requirements.length === 0) {
    return <p className="text-sm text-center text-gray-500 py-4">이 항목에 대한 추가 입력 요구사항이 없습니다.</p>;
  }

  // 각 requirement에 대한 변경 핸들러
  const handleRequirementChange = useCallback((requirementId: string, value: any) => {
    console.log(`💾 저장 중: requirement_id=${requirementId}, value=`, value);
    updateCurrentAnswer(requirementId, value);
  }, [updateCurrentAnswer]);

  return (
    <div className="space-y-8">
      {requirements.map(req => {
        // 현재 requirement에 대한 저장된 값 가져오기
        const currentValue = currentAnswers[req.requirement_id];
        
        console.log(`🎯 렌더링: requirement_id=${req.requirement_id}, data_required_type=${req.data_required_type}, has_input_schema=${!!req.input_schema}`);
        
        return (
          <div key={req.requirement_id}>
            <label htmlFor={`req-${req.requirement_id}`} className="block text-sm font-medium text-gray-800">
              {req.requirement_text_ko}
            </label>
            {req.input_guidance_ko && (
              <p className="mt-1 text-xs text-gray-500">{req.input_guidance_ko}</p>
            )}
            
            {/* 모든 렌더링을 FieldRenderer에 위임 */}
            <div className="mt-2">
              <FieldRenderer
                fieldSchema={req}
                value={currentValue}
                onChange={(value) => handleRequirementChange(req.requirement_id, value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
} 