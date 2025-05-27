"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로컬 스토리지에서 다크모드 상태 불러오기
  useEffect(() => {
    // 기본 설정으로 시스템 설정 확인
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");

    // 저장된 설정이 있으면 사용, 없으면 시스템 설정 사용
    const initialTheme = storedTheme === "dark" || (!storedTheme && systemPrefersDark);
    setIsDarkMode(initialTheme);
    
    // 초기 HTML 클래스 설정
    if (initialTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      
      // 로컬 스토리지에 저장
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      
      // HTML 클래스 업데이트
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 