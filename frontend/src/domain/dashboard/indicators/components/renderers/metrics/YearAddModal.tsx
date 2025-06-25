'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface YearAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (year: string) => void;
  existingYears: string[];
}

export function YearAddModal({ isOpen, onClose, onAdd, existingYears }: YearAddModalProps) {
  const [year, setYear] = React.useState('');
  const [error, setError] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 현재 연도로 초기화
      const currentYear = new Date().getFullYear().toString();
      setYear(currentYear);
      setError('');
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // 유효성 검사
    if (!year.trim()) {
      setError('연도를 입력해주세요.');
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      setError('올바른 연도를 입력해주세요. (1900-2100)');
      return;
    }

    if (existingYears.includes(year)) {
      setError('이미 추가된 연도입니다.');
      return;
    }

    // 연도 추가
    onAdd(year);
    onClose();
  };

  const handleClose = () => {
    setYear('');
    setError('');
    onClose();
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">연도 추가</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              추가할 연도
            </label>
            <input
              id="year"
              type="number"
              min="1900"
              max="2100"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 2024"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* 기존 연도 표시 */}
          {existingYears.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">기존 연도:</p>
              <div className="flex flex-wrap gap-2">
                {existingYears.map((existingYear) => (
                  <span
                    key={existingYear}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {existingYear}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 