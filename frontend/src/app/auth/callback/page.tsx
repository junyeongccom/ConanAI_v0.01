'use client';

import { useAuthCallback } from '@/domain/auth/hooks/useAuthCallback';

export default function AuthCallbackPage() {
  const { isLoading, error, isComplete } = useAuthCallback();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center">
          {isLoading && (
            <>
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                인증 처리 중...
              </h2>
              <p className="text-gray-600">
                Google 인증을 확인하고 있습니다.
              </p>
            </>
          )}

          {isComplete && !error && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-8 h-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-green-900 mb-2">
                로그인 성공!
              </h2>
              <p className="text-gray-600">
                메인 페이지로 이동합니다...
              </p>
            </>
          )}

          {error && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-8 h-8 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-red-900 mb-2">
                로그인 실패
              </h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <div className="text-sm text-gray-500">
                로그인 페이지로 이동합니다...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 