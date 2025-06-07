'use client';

import { useState } from 'react';
import ChatbotWindow from './ChatbotWindow';

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 챗봇 런처 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#5D5FEF] hover:bg-[#4F46E5] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="챗봇 열기"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>

      {/* 챗봇 윈도우 */}
      {isOpen && (
        <ChatbotWindow 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
} 