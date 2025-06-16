'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import GoogleLoginButton from '../../../../domain/auth/components/GoogleLoginButton';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userName, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleMyPageClick = () => {
    router.push('/my-page');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 홈 링크 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">Sky-C</span>
            </Link>
          </div>

          {/* 중앙 네비게이션 메뉴 */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-2">
            <Link 
              href="/climate-risk" 
              className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-md ${
                pathname.startsWith('/climate-risk') 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              기후리스크 평가
            </Link>
            <Link 
              href="/financial-impact" 
              className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-md ${
                pathname.startsWith('/financial-impact') 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              재무영향 시뮬레이션
            </Link>
            <Link 
              href="/tcfd-report" 
              className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-md ${
                pathname.startsWith('/tcfd-report') 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              TCFD보고서 생성
            </Link>
          </nav>

          {/* 우상단 인증 관련 UI */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* 로그인된 상태: 인사말, 마이페이지, 로그아웃 버튼 */}
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    안녕하세요, <span className="font-medium text-blue-600">{userName || '사용자'}</span>님!
                  </span>
                  <button
                    onClick={handleMyPageClick}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-gray-50"
                  >
                    마이페이지
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50 border border-gray-300 hover:border-red-300"
                  >
                    로그아웃
                  </button>
                </div>
                {/* 모바일에서는 간단하게 표시 */}
                <div className="sm:hidden flex items-center space-x-2">
                  <button
                    onClick={handleMyPageClick}
                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    title="마이페이지"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                    title="로그아웃"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 로그인되지 않은 상태: Google 로그인 버튼 */}
                <div className="hidden sm:block">
                  <GoogleLoginButton className="min-w-0 px-4 py-2 text-sm" />
                </div>
                {/* 모바일에서는 간단한 로그인 버튼 */}
                <div className="sm:hidden">
                  <GoogleLoginButton className="min-w-0 px-3 py-2 text-sm" />
                </div>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden ml-2">
            <button 
              type="button" 
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 