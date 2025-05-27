import React from 'react';

interface ChatAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const ChatAvatar: React.FC<ChatAvatarProps> = ({ size = 'md', className = '' }) => (
  <div className={`${sizeMap[size]} rounded-full bg-indigo-600 flex items-center justify-center ${className}`}>
    {/* 로봇 아이콘 (3D로 교체 가능) */}
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <rect x="8" y="10" width="8" height="6" rx="2" strokeWidth="2" />
      <circle cx="10" cy="13" r="1" fill="white" />
      <circle cx="14" cy="13" r="1" fill="white" />
      <rect x="11" y="7" width="2" height="3" rx="1" strokeWidth="2" />
    </svg>
  </div>
);

export default ChatAvatar; 