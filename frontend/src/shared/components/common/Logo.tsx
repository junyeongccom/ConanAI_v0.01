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
      {/* 로고 아이콘 - 데이터베이스 모양 */}
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg`}>
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          {/* 데이터베이스 아이콘 */}
          <path d="M12 3C16.97 3 21 4.34 21 6V18C21 19.66 16.97 21 12 21S3 19.66 3 18V6C3 4.34 7.03 3 12 3ZM12 5C8.13 5 5 5.9 5 7S8.13 9 12 9 19 8.1 19 7 15.87 5 12 5ZM5 9.5C6.58 10.5 9.07 11 12 11S17.42 10.5 19 9.5V12C19 13.1 15.87 14 12 14S5 13.1 5 12V9.5ZM5 14.5C6.58 15.5 9.07 16 12 16S17.42 15.5 19 14.5V17C19 18.1 15.87 19 12 19S5 18.1 5 17V14.5Z"/>
        </svg>
      </div>
      
      {/* 로고 텍스트 */}
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          ConanAI
        </span>
      )}
    </Link>
  );
};

export default Logo; 