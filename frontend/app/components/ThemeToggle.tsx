"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
      aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      )}
    </button>
  );
};

export default ThemeToggle; 