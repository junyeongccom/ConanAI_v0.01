'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardHomePage() {
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
              <span className="text-sm font-semibold text-blue-600">70%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-xs text-gray-500">7/10 요구사항 완료</p>
          </div>

          {/* 전략 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">전략</h3>
              <span className="text-sm font-semibold text-orange-600">50%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-gray-500">12/24 요구사항 완료</p>
          </div>

          {/* 위험관리 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">위험관리</h3>
              <span className="text-sm font-semibold text-yellow-600">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-500">3/10 요구사항 완료</p>
          </div>

          {/* 지표 및 목표 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">지표 및 목표</h3>
              <span className="text-sm font-semibold text-red-600">15%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-xs text-gray-500">3/20 요구사항 완료</p>
          </div>
        </div>
      </div>

      {/* 핵심 지표 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">핵심 지표 요약</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">총 온실가스 배출량 (Scope 1+2)</h3>
                <p className="text-sm text-gray-500">최종 보고 대상 지표</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-600">[구현 예정]</p>
                <p className="text-xs text-gray-400">tCO₂eq</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">잠재적 재무 영향</h3>
                <p className="text-sm text-gray-500">기후 관련 위험 및 기회</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-600">[구현 예정]</p>
                <p className="text-xs text-gray-400">억원</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">탄소중립 목표 달성률</h3>
                <p className="text-sm text-gray-500">2030년 목표 기준</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-600">[구현 예정]</p>
                <p className="text-xs text-gray-400">%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 및 알림 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 활동 & 알림</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">최근 수정된 요구사항</h3>
              <p className="text-sm text-gray-600">S2-1 전략 - 기후 관련 위험 및 기회 식별</p>
              <p className="text-xs text-gray-400">2025.06.17 오후 3:45</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">다가오는 마감 기한</h3>
              <p className="text-sm text-gray-600">Scope 1 온실가스 배출량 데이터 입력</p>
              <p className="text-xs text-gray-400">2025.07.31 (44일 남음)</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">완료된 작업</h3>
              <p className="text-sm text-gray-600">지배구조 - 이사회 기후 관련 역할 및 책임</p>
              <p className="text-xs text-gray-400">2025.06.15 오전 10:20</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">주의 필요</h3>
              <p className="text-sm text-gray-600">데이터 품질 검증 - 3개 항목 검토 필요</p>
              <p className="text-xs text-gray-400">2025.06.16 오후 2:15</p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 실행 버튼 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 실행</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleNewReport}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-gray-900 group-hover:text-blue-700">새 보고서 생성</span>
            <span className="text-sm text-gray-500 mt-1">TCFD 보고서 작성</span>
          </button>

          <button
            onClick={handleContinueDataEntry}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-gray-400 group-hover:text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium text-gray-900 group-hover:text-green-700">데이터 입력 계속하기</span>
            <span className="text-sm text-gray-500 mt-1">미완료 지표 작성</span>
          </button>

          <button
            onClick={handleClimateRisk}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium text-gray-900 group-hover:text-orange-700">기후리스크 평가</span>
            <span className="text-sm text-gray-500 mt-1">위험 분석 도구</span>
          </button>

          <button
            onClick={handleFinancialImpact}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 group"
          >
            <svg className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="font-medium text-gray-900 group-hover:text-purple-700">재무영향 시뮬레이션</span>
            <span className="text-sm text-gray-500 mt-1">영향 분석 도구</span>
          </button>
        </div>
      </div>
    </div>
  );
} 