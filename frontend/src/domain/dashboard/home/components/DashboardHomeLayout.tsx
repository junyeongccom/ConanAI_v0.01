'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const DashboardHomeLayout: React.FC = () => {
  const router = useRouter();

  // 빠른 실행 버튼 핸들러들
  const handleNewReport = () => {
    router.push('/tcfd-report');
  };

  const handleContinueDataEntry = () => {
    router.push('/dashboard/indicators');
  };

  const handleClimateRisk = () => {
    router.push('/climate-risk');
  };

  const handleFinancialImpact = () => {
    router.push('/financial-impact');
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">대시보드 홈</h1>
        <p className="text-gray-600">
          IFRS S2 기후공시 데이터 관리 현황과 주요 지표를 한눈에 확인하세요.
        </p>
      </div>

      {/* 데이터 입력 현황 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">공시 섹션별 데이터 입력 현황</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 지배구조 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">지배구조</h3>
              <span className="text-sm font-semibold text-green-600">70%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">7/10</span> 요구사항 완료
            </div>
            <div className="text-xs text-gray-500 mt-1">
              기후 관련 감독 및 경영진 역할
            </div>
          </div>

          {/* 전략 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">전략</h3>
              <span className="text-sm font-semibold text-yellow-600">50%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">12/24</span> 요구사항 완료
            </div>
            <div className="text-xs text-gray-500 mt-1">
              위험, 기회 및 재무 영향 식별
            </div>
          </div>

          {/* 위험관리 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">위험관리</h3>
              <span className="text-sm font-semibold text-orange-600">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">3/10</span> 요구사항 완료
            </div>
            <div className="text-xs text-gray-500 mt-1">
              기후 관련 위험 식별 및 관리
            </div>
          </div>

          {/* 지표 및 목표 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">지표 및 목표</h3>
              <span className="text-sm font-semibold text-red-600">15%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">3/20</span> 요구사항 완료
            </div>
            <div className="text-xs text-gray-500 mt-1">
              GHG 배출량, 기후 목표 등
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 지표 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">온실가스 배출량</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Scope 1</span>
              <span className="font-semibold">1,250 tCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scope 2</span>
              <span className="font-semibold">850 tCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scope 3</span>
              <span className="font-semibold text-orange-600">데이터 입력 필요</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기후 위험 평가</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">물리적 위험</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">보통</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">전환 위험</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">높음</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">기회 요인</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">중간</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">재무 영향</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">예상 비용</span>
              <span className="font-semibold text-red-600">₩2.1억</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예상 수익</span>
              <span className="font-semibold text-green-600">₩1.5억</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">순 영향</span>
              <span className="font-semibold text-red-600">-₩6,000만</span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 및 알림 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Scope 1 배출량 데이터 업데이트 완료</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">기후 시나리오 분석 진행 중</p>
                <p className="text-xs text-gray-500">1일 전</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">재무 영향 평가 검토 필요</p>
                <p className="text-xs text-gray-500">3일 전</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 및 할 일</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-red-100 text-red-600 text-xs rounded flex items-center justify-center mt-1">!</div>
              <div>
                <p className="text-sm text-gray-900">Scope 3 배출량 데이터 입력 마감일</p>
                <p className="text-xs text-gray-500">7일 남음</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-yellow-100 text-yellow-600 text-xs rounded flex items-center justify-center mt-1">⚠</div>
              <div>
                <p className="text-sm text-gray-900">분기별 TCFD 보고서 작성</p>
                <p className="text-xs text-gray-500">14일 남음</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-blue-100 text-blue-600 text-xs rounded flex items-center justify-center mt-1">i</div>
              <div>
                <p className="text-sm text-gray-900">새로운 기후 규제 업데이트</p>
                <p className="text-xs text-gray-500">확인 권장</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 실행 버튼들 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleNewReport}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">새 보고서</span>
          </button>

          <button
            onClick={handleContinueDataEntry}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">데이터 입력</span>
          </button>

          <button
            onClick={handleClimateRisk}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">위험 평가</span>
          </button>

          <button
            onClick={handleFinancialImpact}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">재무 영향</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 