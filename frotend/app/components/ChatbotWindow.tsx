import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! Conan 챗봇입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://railwaychatbot-production.up.railway.app/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, user_id: null }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '응답에 실패했습니다.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`fixed bottom-32 right-8 w-96 max-w-[95vw] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
      `}
      style={{ boxShadow: '0 8px 32px rgba(60,60,120,0.18)' }}
    >
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <img
              src="/images/chatbot-avatar.png"
              alt="Conan 챗봇 아바타"
              className="w-10 h-10 rounded-full mr-3 shadow-sm"
            />
            <span className="font-bold text-gray-800">Conan 챗봇</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="챗봇 닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <img
                  src="/images/chatbot-avatar.png"
                  alt="Conan 챗봇 아바타"
                  className="w-8 h-8 rounded-full mr-2 shadow-md"
                />
              )}
              <div
                className={`rounded-xl px-4 py-2 max-w-[75%] shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <img
                src="/images/chatbot-avatar.png"
                alt="Conan 챗봇 아바타"
                className="w-8 h-8 rounded-full mr-2 shadow-md"
              />
              <div className="bg-gray-200 rounded-xl px-4 py-2 max-w-[75%] shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
              disabled={loading}
            >
              전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotWindow; 