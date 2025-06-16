import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/authService';

interface UseAuthCallbackState {
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
}

export function useAuthCallback() {
  const router = useRouter();
  const [state, setState] = useState<UseAuthCallbackState>({
    isLoading: true,
    error: null,
    isComplete: false,
  });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 현재 URL에서 콜백 처리
        const currentUrl = window.location.href;
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const result = await AuthService.handleCallback(currentUrl);

        if (result.success) {
          setState(prev => ({ ...prev, isLoading: false, isComplete: true }));
          
          // 성공 시 메인 페이지로 리다이렉트 (약간의 지연 후)
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: result.error || '인증에 실패했습니다.' 
          }));

          // 실패 시 로그인 페이지로 리다이렉트 (3초 후)
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('콜백 처리 중 예외 발생:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: '예상치 못한 오류가 발생했습니다.' 
        }));

        // 오류 시 로그인 페이지로 리다이렉트 (3초 후)
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return state;
} 