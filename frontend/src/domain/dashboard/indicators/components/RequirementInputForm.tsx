'use client';

import { useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { RequirementData } from '../types';
import { useAnswerStore } from '../stores/answerStore';

interface RequirementInputFormProps {
  requirements: RequirementData[];
}

/**
 * 요구사항 배열을 받아 동적으로 입력 폼을 생성하는 컴포넌트입니다.
 * 이 컴포넌트는 오직 UI 렌더링에만 집중합니다.
 */
export function RequirementInputForm({ requirements }: RequirementInputFormProps) {
  // 스토어의 상태와 액션을 가져옵니다.
  const { answers, setAnswer } = useAnswerStore();

  // 디버깅: 컴포넌트 마운트 시 스토어 상태 확인
  useEffect(() => {
    console.log('🔍 RequirementInputForm 마운트됨');
    console.log('📦 현재 스토어 상태:', answers);
    console.log('🗄️ localStorage 확인:', localStorage.getItem('skyc-unsaved-answers'));
  }, []);

  // 디버깅: answers 상태 변경 감지
  useEffect(() => {
    console.log('📝 답변 상태 변경됨:', answers);
  }, [answers]);

  // 요구사항이 없는 경우를 위한 UI 처리
  if (requirements.length === 0) {
    return <p className="text-sm text-center text-gray-500 py-4">이 항목에 대한 추가 입력 요구사항이 없습니다.</p>;
  }

  // onChange 이벤트 핸들러 함수
  const handleChange = (requirementId: number, value: any) => {
    console.log(`💾 저장 중: requirement_id=${requirementId}, value=${value}`);
    // 사용자가 입력할 때마다 Zustand 스토어에 값을 저장합니다.
    setAnswer(requirementId, value);
  };

  const renderInput = (req: RequirementData) => {
    // 스토어에서 현재 requirement에 해당하는 값을 가져옵니다.
    const currentValue = answers[req.requirement_id]?.answer_value || '';
    
    console.log(`🎯 렌더링: requirement_id=${req.requirement_id}, currentValue="${currentValue}"`);
    
    const commonProps = {
      id: `req-${req.requirement_id}`,
      className: "block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none",
      placeholder: req.input_placeholder_ko || '',
      // controlled component로 value와 onChange 사용
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(req.requirement_id, e.target.value),
    };

    switch (req.data_required_type) {
      case 'text_long': // 긴 텍스트
        return (
          <TextareaAutosize 
            {...commonProps} 
            minRows={4} 
            maxRows={15}
            cacheMeasurements 
          />
        );
      case 'number':
        return (
          <input 
            type="number" 
            {...commonProps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleChange(req.requirement_id, e.target.value)
            }
          />
        );
      case 'boolean':
        return (
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                checked={currentValue === true || currentValue === 'true'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange(req.requirement_id, e.target.checked)
                }
              />
              <span className="ml-2">예 / 아니오</span>
            </label>
          </div>
        );
      case 'text': // 짧은 텍스트 (기본값)
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('현재 저장된 답변들:', answers);
    console.log('제출용 데이터:', useAnswerStore.getState().getAnswersForSubmission());
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {requirements.map(req => (
        <div key={req.requirement_id}>
                      <label htmlFor={`req-${req.requirement_id}`} className="block text-sm font-medium text-gray-800">
              {req.requirement_text_ko}
            </label>
          {req.input_guidance_ko && (
            <p className="mt-1 text-xs text-gray-500">{req.input_guidance_ko}</p>
          )}
          {renderInput(req)}
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          답변 저장
        </button>
      </div>
    </form>
  );
} 