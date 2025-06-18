'use client';

import { RequirementData } from '../types';

interface RequirementInputFormProps {
  requirements: RequirementData[];
}

/**
 * 요구사항 배열을 받아 동적으로 입력 폼을 생성하는 컴포넌트입니다.
 * 이 컴포넌트는 오직 UI 렌더링에만 집중합니다.
 */
export function RequirementInputForm({ requirements }: RequirementInputFormProps) {
  // 요구사항이 없는 경우를 위한 UI 처리
  if (requirements.length === 0) {
    return <p className="text-sm text-center text-gray-500 py-4">이 항목에 대한 추가 입력 요구사항이 없습니다.</p>;
  }

  // data_required_type에 따라 다른 입력 필드를 반환하는 헬퍼 함수
  const renderInput = (req: RequirementData) => {
    const commonProps = {
      id: `req-${req.requirement_id}`,
      className: "block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      placeholder: req.input_placeholder_ko || '',
    };

    switch (req.data_required_type) {
      case 'text_long': // 긴 텍스트
        return <textarea {...commonProps} rows={4} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'boolean':
        return (
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" />
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
    // 향후 이 곳에서 폼 데이터 취합 및 서버 전송 로직 구현
    console.log('Form submitted!');
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