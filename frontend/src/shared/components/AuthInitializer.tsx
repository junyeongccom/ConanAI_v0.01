'use client';

import { useEffect } from 'react';
import { AuthService } from '@/domain/auth/services/authService';

export default function AuthInitializer() {
  useEffect(() => {
    // 애플리케이션 초기화 시 인증 상태 복구
    AuthService.initializeAuth();
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
} 