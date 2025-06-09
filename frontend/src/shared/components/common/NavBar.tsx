'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV } from '../../constants/nav';
import Logo from './Logo';

const NavBar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* 로고 */}
          <Logo size="md" />

          {/* 네비게이션 메뉴 */}
          <div className="flex space-x-8 ml-8">
            {MAIN_NAV.map((menuItem) => (
              <Link
                key={menuItem.href}
                href={menuItem.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(menuItem.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {menuItem.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 