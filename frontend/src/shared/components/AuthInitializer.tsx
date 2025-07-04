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
        // 인증 확인 실패는 조용히 처리합니다. 
        // 네트워크 문제 등으로 초기 확인에 실패할 수 있으며, 
        // 이는 사용자가 로그인하지 않은 상태로 간주됩니다.
        console.log('Initial authentication check failed silently.', error);
      }
    };
    
    init();
  }, [checkAuthStatus]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
} 