'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../shared/hooks/useAuth';
import Header from '@/shared/components/layout/Header/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isInitialized } = useAuth();

  // 인증 상태 초기화가 완료된 후에만 리다이렉트 체크
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      console.log('🔄 인증되지 않은 사용자 - 로그인 페이지로 리다이렉트');
      router.push('/login');
    }
  }, [isLoggedIn, isInitialized, router]);

  // 인증 상태 초기화가 완료되지 않았거나 로그인되지 않은 상태에서는 로딩 표시
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // 초기화는 완료되었지만 로그인되지 않은 상태 (리다이렉트 진행 중)
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header 컴포넌트 */}
      <Header />
      
      {/* 사이드바 - fixed 포지셔닝으로 Header 바로 아래에 붙이기 */}
      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white shadow-lg border-r border-gray-200 flex flex-col z-40 overflow-y-auto">
        {/* 사이드바 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">대시보드</h2>
          <p className="text-sm text-gray-600 mt-1">IFRS S2 기후공시 데이터 관리 및 추가 지표를 한눈에 확인하세요.</p>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard/home" 
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  pathname === '/dashboard/home' || pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/indicators" 
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  pathname === '/dashboard/indicators'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                지표 및 데이터 관리
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/report" 
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  pathname === '/dashboard/report'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2a2 2 0 012-2h6z" />
                </svg>
                보고서 생성
              </Link>
            </li>
          </ul>
        </nav>

        {/* 사이드바 하단 도움말 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="mb-2 font-medium">도움이 필요하신가요?</p>
            <a href="#" className="text-blue-600 hover:text-blue-700 underline block mb-1">
              사용 가이드 보기
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 underline block">
              고객지원 문의
            </a>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 - 사이드바 너비만큼 왼쪽 마진 추가 */}
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 