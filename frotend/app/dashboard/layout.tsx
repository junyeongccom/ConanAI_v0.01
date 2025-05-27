// app/dashboard/layout.tsx
'use client';

import React from 'react';
import { SidebarProvider, useSidebar } from './layout/vertical/SidebarContext';
import { ThemeProvider } from '../context/ThemeContext';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import Header from './layout/vertical/header/Header';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900 font-pretendard text-gray-900 dark:text-gray-100">
      {/* 모바일에서 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className="page-wrapper flex w-full">
        {/* 사이드바 */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar />
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="body-wrapper w-full min-h-screen transition-all duration-300">
          <Header />
          <main 
            className="pt-16 px-6" 
            onClick={(e) => {
              if (isSidebarOpen && window.innerWidth < 1024) {
                toggleSidebar();
              }
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}
