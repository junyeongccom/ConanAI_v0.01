"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "../SidebarContext";
import ThemeToggle from "../../../../components/ThemeToggle";

const Header = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 h-16 fixed top-0 right-0 left-0 z-20">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/70 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors duration-200 flex items-center justify-center"
            aria-label="메뉴 열기/닫기"
          >
            <svg
              className="w-6 h-6 text-indigo-600 dark:text-indigo-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="ml-4 text-lg font-semibold text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
            Conan<span className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">AI</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* 다른 헤더 아이템들 */}
        </div>
      </div>
    </header>
  );
};

export default Header; 