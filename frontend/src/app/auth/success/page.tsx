'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/domain/auth/services/authService';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // AuthService를 통해 콜백 처리
        const result = await AuthService.handleCallback(window.location.href);
        
        if (result.success) {
          setStatus('success');
          // 성공 메시지를 잠시 보여준 후 메인 페이지로 이동
          setTimeout(() => router.push('/'), 2000);
        } else {
          setStatus('error');
          setTimeout(() => router.push('/'), 3000);
        }
        
      } catch (error) {
        console.error('인증 처리 오류:', error);
        setStatus('error');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleAuthSuccess();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 처리 중...</h2>
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 성공!</h2>
              <p className="text-gray-600">곧 메인 페이지로 이동합니다.</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 실패</h2>
              <p className="text-gray-600">인증 처리 중 오류가 발생했습니다. 메인 페이지로 이동합니다.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 