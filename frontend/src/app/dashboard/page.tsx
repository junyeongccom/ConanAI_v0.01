'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // /dashboard 접속 시 자동으로 /dashboard/home으로 리다이렉트
    router.replace('/dashboard/home');
  }, [router]);

  // 리다이렉트 중이므로 UI를 렌더링하지 않음
  return null;
} 