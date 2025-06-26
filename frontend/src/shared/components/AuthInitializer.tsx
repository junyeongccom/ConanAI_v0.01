'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/shared/store/authStore';

export default function AuthInitializer() {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    // 콘솔 에러 임시 억제
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const suppressAuthErrors = (message: any, ...args: any[]) => {
      const messageStr = String(message);
      // 인증 관련 에러는 무시
      if (messageStr.includes('Failed to fetch') || 
          messageStr.includes('fetch') || 
          messageStr.includes('NetworkError') ||
          messageStr.includes('ERR_INTERNET_DISCONNECTED')) {
        return;
      }
      originalConsoleError(message, ...args);
    };

    const init = async () => {
      // 에러 억제 활성화
      console.error = suppressAuthErrors;
      console.warn = suppressAuthErrors;
      
      try {
        await checkAuthStatus();
      } catch (error) {
        // 에러를 조용히 처리
      } finally {
        // 에러 억제 해제 (1초 후)
        setTimeout(() => {
          console.error = originalConsoleError;
          console.warn = originalConsoleWarn;
        }, 1000);
      }
    };
    
    init();
  }, [checkAuthStatus]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
} 