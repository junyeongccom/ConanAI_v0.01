import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {/* 로고 아이콘 */}
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg`}>
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          {/* AI/분석 관련 아이콘 */}
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      
      {/* 로고 텍스트 */}
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Conan
        </span>
      )}
    </Link>
  );
};

export default Logo; 