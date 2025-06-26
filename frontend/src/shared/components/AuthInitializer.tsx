'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/shared/store/authStore';

export default function AuthInitializer() {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.log("초기 인증 확인 실패 (로그아웃 상태)");
      }
    };
    init();
  }, [checkAuthStatus]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
} 