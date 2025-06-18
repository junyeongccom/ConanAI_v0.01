'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../shared/hooks/useAuth';
import { FaUser, FaChartLine, FaFileAlt, FaSignOutAlt, FaCog, FaBell } from 'react-icons/fa';

export const MyPageLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">
            계정 정보와 서비스 이용 현황을 확인하고 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 사용자 정보 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-blue-600 text-2xl" />
                </div>
                {user ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">게스트</h2>
                    <p className="text-gray-600 mb-4">로그인이 필요합니다</p>
                  </>
                )}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors duration-200">
                    <FaCog className="mr-2" />
                    계정 설정
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors duration-200">
                    <FaBell className="mr-2" />
                    알림 설정
                  </button>
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" />
                      로그아웃
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 서비스 이용 현황 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스 이용 현황</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FaChartLine className="text-blue-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">기후리스크 평가</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FaFileAlt className="text-green-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">재무영향 분석</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FaFileAlt className="text-purple-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">TCFD 보고서</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">최근 활동</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">TCFD 보고서 생성</p>
                      <p className="text-xs text-gray-500">2025.06.17 15:30</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">완료</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">기후 리스크 분석</p>
                      <p className="text-xs text-gray-500">2025.06.16 10:15</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">진행중</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">재무영향 평가</p>
                      <p className="text-xs text-gray-500">2025.06.15 14:22</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">완료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 바로가기 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 바로가기</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <FaChartLine className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">대시보드</span>
                </Link>

                <Link
                  href="/service/climate-risk"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                    <FaChartLine className="text-yellow-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">기후 리스크</span>
                </Link>

                <Link
                  href="/service/financial-impact"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <FaFileAlt className="text-green-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">재무 영향</span>
                </Link>

                <Link
                  href="/service/tcfd-report"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <FaFileAlt className="text-purple-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">TCFD 보고서</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
