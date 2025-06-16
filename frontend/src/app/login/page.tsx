'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/domain/auth/components/GoogleLoginButton';
import { useAuthStore } from '@/shared/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 로그인된 사용자에게는 빈 화면 표시 (리다이렉트 처리 중)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">리다이렉트 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고/브랜딩 영역 */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg 
              className="w-10 h-10 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sky-C
          </h1>
          <p className="text-gray-600 text-lg">
            기후 리스크 분석 플랫폼
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              로그인
            </h2>
            <p className="text-gray-600">
              Google 계정으로 간편하게 시작하세요
            </p>
          </div>

          {/* Google 로그인 버튼 */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              로그인하면{' '}
              <a href="#" className="text-blue-600 hover:underline">
                이용약관
              </a>
              {' '}및{' '}
              <a href="#" className="text-blue-600 hover:underline">
                개인정보처리방침
              </a>
              에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </div>

        {/* 서비스 소개 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            🌍 기후변화 시나리오 분석 | 💼 재무 영향 평가 | 📊 TCFD 보고서 생성
          </p>
        </div>
      </div>
    </div>
  );
} 