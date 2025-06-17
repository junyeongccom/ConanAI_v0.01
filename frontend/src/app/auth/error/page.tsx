'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'unknown_error';

  useEffect(() => {
    // 5초 후 메인 페이지로 자동 이동
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const getErrorMessage = (error: string) => {
    const errorMessages: Record<string, string> = {
      'access_denied': '사용자가 인증을 거부했습니다.',
      'missing_code': '인증 코드를 받지 못했습니다.',
      'missing_token': '토큰을 받지 못했습니다.',
      'auth_failed': '인증 처리에 실패했습니다.',
      'server_error': '서버 오류가 발생했습니다.',
      'unknown_error': '알 수 없는 오류가 발생했습니다.',
    };

    return errorMessages[error] || errorMessages['unknown_error'];
  };

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 mb-8">{getErrorMessage(errorMessage)}</p>
          
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              메인 페이지로 돌아가기
            </button>
            
            <div className="text-sm text-gray-500">
              <p>5초 후 자동으로 메인 페이지로 이동합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
} 