'use client';

import { useState, useEffect } from 'react';

export function usePWA() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 초기 온라인 상태 설정
    setIsOnline(navigator.onLine);

    // PWA 설치 상태 확인
    const checkInstallStatus = () => {
      // 스탠드얼론 모드 확인 (홈 화면에서 실행)
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(standalone);
      
      // iOS Safari에서 홈 화면에 추가된 경우
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = (window.navigator as any).standalone;
      
      setIsInstalled(standalone || (isIOS && isInStandaloneMode));
    };

    checkInstallStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isInstalled,
    isStandalone,
  };
} 