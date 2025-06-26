'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';

export default function AuthSuccessPage() {
  const router = useRouter();
  // Zustand 스토어에서 직접 액션 가져오기
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        // 이제 쿠키가 설정되었으므로, 이 API 호출은 성공해야 함
        await checkAuthStatus(); 
        console.log("✅ 인증 상태 확인 성공, 대시보드로 이동합니다.");
        // 성공 시 대시보드로 리다이렉트
        router.push('/dashboard');
      } catch (error) {
        console.error("❌ 인증 상태 확인 실패:", error);
        // 실패 시 로그인 페이지로 리다이렉트
        router.push('/login');
      }
    };

    handleLoginSuccess();
  }, [router, checkAuthStatus]);

  // 사용자는 이 화면을 거의 보지 못함
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
} 