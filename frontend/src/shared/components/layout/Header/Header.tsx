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
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!user;
  const userName = user?.name;
  const userEmail = user?.email;

  // 디버깅을 위한 로그
  console.log('🧪 Header 상태:', {
    isLoggedIn,
    userName,
    userEmail,
    isDropdownOpen,
    user
  });

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 드롭다운 외부 클릭 감지 (사용자 드롭다운만)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 메가 메뉴 마우스 이벤트 처리
  const handleNavMouseEnter = () => {
    // 모든 페이지에서 메가 메뉴 활성화 (대시보드 포함)
    setShowMegaMenu(true);
  };

  const handleNavMouseLeave = () => {
    // 약간의 지연을 주어 메가 메뉴로 이동할 시간을 제공
    setTimeout(() => {
      // 네비게이션이나 메가 메뉴에 마우스가 없으면 닫기
      const isNavHovered = navRef.current?.matches(':hover');
      const isMegaMenuHovered = megaMenuRef.current?.matches(':hover');
      
      if (!isNavHovered && !isMegaMenuHovered) {
        setShowMegaMenu(false);
      }
    }, 100);
  };

  const handleMegaMenuMouseEnter = () => {
    setShowMegaMenu(true);
  };

  const handleMegaMenuMouseLeave = () => {
    setShowMegaMenu(false);
  };

  const handleDropdownToggle = () => {
    // 사용자 드롭다운 토글 시 메가 메뉴 숨기기
    if (showMegaMenu) {
      setShowMegaMenu(false);
    }
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
            ref={navRef}
            className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-1"
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
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
                  <button
                    className={`inline-flex items-center text-sm font-medium transition-all duration-200 px-4 py-2 rounded-md ${
                      isActiveMenu(item)
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : `${!isMainPage || isScrolled || isDashboardPage ? 'text-gray-700 hover:bg-gray-50' : 'text-white hover:bg-white/10'} hover:text-blue-600`
                    }`}
                  >
                    {item.name}
                    <svg 
                      className={`w-4 h-4 ml-1 transition-all duration-300 ease-out ${
                        showMegaMenu ? 'transform rotate-180' : 'transform rotate-0'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[150]">
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

      {/* 통합 메가 메뉴 - header 바깥에 위치, 드롭다운 활성화 시 사이드바보다 위에 */}
      {(!isDashboardPage || showMegaMenu) && (
        <div className={`absolute top-full left-0 right-0 overflow-hidden transition-all duration-400 ease-out ${
          isDashboardPage 
            ? 'z-[100] pointer-events-auto' // 대시보드에서 활성화된 경우만 렌더링
            : 'z-50'
        }`}>
        <div className={`flex justify-center transition-all duration-400 ease-out ${
          showMegaMenu 
            ? 'opacity-100 pointer-events-auto transform translate-y-0' 
            : 'opacity-0 pointer-events-none transform -translate-y-8'
        }`}>
          <div 
            ref={megaMenuRef}
            data-mega-menu
            className={`w-[900px] bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 mt-1 backdrop-blur-sm border border-gray-100 transition-all duration-400 ease-out relative ${
              isDashboardPage && showMegaMenu ? 'z-[101]' : ''
            } ${
              showMegaMenu 
                ? 'transform translate-y-0 scale-100' 
                : 'transform -translate-y-4 scale-95'
            }`}
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleMegaMenuMouseLeave}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
              boxShadow: showMegaMenu 
                ? '0 20px 60px -10px rgba(0, 0, 0, 0.15), 0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                : '0 5px 20px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
                              <div className="p-8">
                  <div className="grid grid-cols-5 gap-6">
                    {mainNavItems.map((item, columnIndex) => (
                      <div 
                        key={item.name}
                        className={`transform transition-all duration-400 ease-out ${
                          showMegaMenu 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-6 opacity-0'
                        }`}
                        style={{
                          transitionDelay: showMegaMenu ? `${columnIndex * 80}ms` : '0ms'
                        }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 relative">
                          {item.name}
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 group-hover:w-full"></div>
                        </h3>
                        <ul className="space-y-3">
                          {item.subItems.length > 0 ? (
                            item.subItems.map((subItem, itemIndex) => (
                              <li 
                                key={subItem.href}
                                className={`transform transition-all duration-400 ease-out ${
                                  showMegaMenu 
                                    ? 'translate-x-0 opacity-100' 
                                    : 'translate-x-4 opacity-0'
                                }`}
                                style={{
                                  transitionDelay: showMegaMenu ? `${(columnIndex * 80) + (itemIndex * 40) + 150}ms` : '0ms'
                                }}
                              >
                                <Link
                                  href={subItem.href as any}
                                  className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                                    pathname.startsWith(subItem.href)
                                      ? 'text-blue-600 bg-blue-50 font-medium border border-blue-200'
                                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li
                              className={`transform transition-all duration-400 ease-out ${
                                showMegaMenu 
                                  ? 'translate-x-0 opacity-100' 
                                  : 'translate-x-4 opacity-0'
                              }`}
                              style={{
                                transitionDelay: showMegaMenu ? `${(columnIndex * 80) + 150}ms` : '0ms'
                              }}
                            >
                              <Link
                                href={item.href as any}
                                onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                                className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                                  pathname.startsWith(item.href)
                                    ? 'text-blue-600 bg-blue-50 font-medium border border-blue-200'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
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