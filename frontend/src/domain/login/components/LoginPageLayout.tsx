import React from 'react';

export const LoginPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sky-C에 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            IFRS S2 기후공시 솔루션
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-600 mb-4">
            로그인 기능은 구현 예정입니다.
          </p>
          <a
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            홈페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}; 