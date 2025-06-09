'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

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
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center">
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
          </nav>

          {/* 빈 공간 (균형을 위해) */}
          <div className="w-32"></div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
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