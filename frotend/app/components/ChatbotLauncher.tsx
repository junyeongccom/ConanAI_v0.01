import React, { useState } from 'react';
import ChatbotWindow from './ChatbotWindow';

const ChatbotLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 말풍선 안내문구 */}
      {!isOpen && (
        <div className="fixed bottom-28 right-8 z-50 flex items-end animate-fade-in">
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-2 text-sm text-gray-800 font-medium relative mr-2 max-w-xs">
            안녕하세요, ConanAI 챗봇입니다.<br />저를 클릭해보세요
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></span>
          </div>
        </div>
      )}
      {/* 챗봇 런처 버튼 */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center z-50 hover:bg-indigo-700 transition"
        aria-label="챗봇 열기"
        style={{ boxShadow: '0 4px 16px rgba(60,60,120,0.18)' }}
      >
        <img
          src="/images/chatbot-avatar.png"
          alt="Conan 챗봇 아바타"
          className="w-16 h-16 rounded-full shadow-lg"
        />
      </button>
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotLauncher; 