'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import GoogleLoginButton from '../../../../domain/auth/components/GoogleLoginButton';

// 메인 네비게이션 아이템 정의
const mainNavItems = [
  {
    name: "About",
    href: "#",
    subItems: [
      { name: "SKY-C에 관하여", href: "/about/project" },
      { name: "개발자에 관하여", href: "/about/developer" },
    ]
  },
  {
    name: "Basic",
    href: "#",
    subItems: [
      { name: "ISSB 도입 현황", href: "/basic/adoption-status" },
      { name: "기후공시 개념 정의", href: "/basic/concepts" },
    ]
  },
  {
    name: "Service",
    href: "#",
    subItems: [
      { name: "기후리스크 평가", href: "/service/climate-risk" },
      { name: "재무영향 시뮬레이션", href: "/service/financial-impact" },
      { name: "TCFD 보고서 생성", href: "/service/tcfd-report" },
    ]
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    subItems: []
  },
  {
    name: "Report",
    href: "/report",
    subItems: []
  }
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!user;
  const userName = user?.name;
  const userEmail = user?.email;

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleMyPageClick = () => {
    setIsDropdownOpen(false);
    router.push('/my-page');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  // 메인페이지가 아닌 다른 페이지인지 확인
  const isMainPage = pathname === '/';
  const isDashboardPage = pathname.startsWith('/dashboard');

  // 현재 경로가 메뉴 항목과 일치하는지 확인
  const isActiveMenu = (item: typeof mainNavItems[0]) => {
    if (item.subItems.length === 0) {
      return pathname.startsWith(item.href);
    }
    return item.subItems.some(subItem => pathname.startsWith(subItem.href));
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      !isMainPage || isScrolled || isDashboardPage
        ? 'bg-white shadow-md border-b border-gray-200' 
        : 'bg-transparent shadow-none border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 홈 링크 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200 ${
                !isMainPage || isScrolled || isDashboardPage ? 'text-gray-900' : 'text-white'
              }`}
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
          <nav 
            className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-1"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            {mainNavItems.map((item) => (
              <div key={item.name} className="relative">
                {item.subItems.length === 0 ? (
                  <button
                    onClick={item.name === 'Dashboard' ? handleDashboardClick : () => router.push(item.href as any)}
                    className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-md ${
                      isActiveMenu(item)
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : `${!isMainPage || isScrolled || isDashboardPage ? 'text-gray-700 hover:bg-gray-50' : 'text-white hover:bg-white/10'} hover:text-blue-600`
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href as any}
                    className={`inline-flex items-center text-sm font-medium transition-all duration-200 px-4 py-2 rounded-md ${
                      isActiveMenu(item)
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : `${!isMainPage || isScrolled || isDashboardPage ? 'text-gray-700 hover:bg-gray-50' : 'text-white hover:bg-white/10'} hover:text-blue-600`
                    }`}
                  >
                    {item.name}
                    <svg 
                      className="w-4 h-4 ml-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* 우상단 인증 관련 UI */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* 사용자 드롭다운 버튼 */}
                <button
                  onClick={handleDropdownToggle}
                  className={`flex items-center space-x-2 text-sm font-medium hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    !isMainPage || isScrolled || isDashboardPage ? 'text-gray-700 hover:bg-gray-50' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {(userName || userEmail || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{userName || userEmail || '사용자'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {userName || userEmail || '사용자'}
                      </div>
                      <button
                        onClick={handleMyPageClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        마이페이지
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              className={`hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200 ${
                !isMainPage || isScrolled || isDashboardPage ? 'text-gray-700' : 'text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 통합 메가 메뉴 - header 바깥에 위치, 대시보드 페이지에서는 렌더링하지 않음 */}
      {!isDashboardPage && (
        <div className="absolute top-full left-0 right-0 z-40">
          <div className={`flex justify-center transition-all duration-300 ${
            showMegaMenu 
              ? 'opacity-100 pointer-events-auto transform translate-y-0' 
              : 'opacity-0 pointer-events-none transform -translate-y-2'
          }`}>
            <div 
              className="w-[900px] bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 mt-1"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <div className="p-8">
                <div className="grid grid-cols-5 gap-6">
                  {mainNavItems.map((item) => (
                    <div key={item.name}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        {item.name}
                      </h3>
                      <ul className="space-y-3">
                        {item.subItems.length > 0 ? (
                          item.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href as any}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                  pathname.startsWith(subItem.href)
                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li>
                            <Link
                              href={item.href as any}
                              onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                              className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                pathname.startsWith(item.href)
                                  ? 'text-blue-600 bg-blue-50 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                              }`}
                            >
                              {item.name === 'Dashboard' ? '대시보드' : item.name === 'Report' ? '간행물' : item.name}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 