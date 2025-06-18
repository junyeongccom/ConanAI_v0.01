'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const DashboardIndicatorsLayout: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 더미 데이터 (백엔드 연동 예정)
  const indicators = [
    {
      id: 1,
      code: 'S2-1',
      title: '기후 관련 위험 및 기회 식별',
      section: '전략',
      category: '위험 평가',
      status: 'completed',
      progress: 100,
      lastUpdated: '2025.06.15',
      hasIssues: false
    },
    {
      id: 2,
      code: 'S2-2',
      title: '기후 관련 위험 및 기회의 재무적 영향',
      section: '전략',
      category: '재무 영향',
      status: 'in_progress',
      progress: 60,
      lastUpdated: '2025.06.17',
      hasIssues: true
    },
    {
      id: 3,
      code: 'S2-14',
      title: '온실가스 배출량 (Scope 1)',
      section: '지표 및 목표',
      category: '배출량',
      status: 'not_started',
      progress: 0,
      lastUpdated: '-',
      hasIssues: false
    },
    {
      id: 4,
      code: 'S2-15',
      title: '온실가스 배출량 (Scope 2)',
      section: '지표 및 목표',
      category: '배출량',
      status: 'draft',
      progress: 25,
      lastUpdated: '2025.06.10',
      hasIssues: false
    },
    {
      id: 5,
      code: 'S2-6',
      title: '기후 관련 위험 관리 프로세스',
      section: '위험관리',
      category: '프로세스',
      status: 'completed',
      progress: 100,
      lastUpdated: '2025.06.12',
      hasIssues: false
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: '완료', class: 'bg-green-100 text-green-800' },
      in_progress: { label: '작성 중', class: 'bg-blue-100 text-blue-800' },
      draft: { label: '초안', class: 'bg-yellow-100 text-yellow-800' },
      not_started: { label: '미작성', class: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const handleSelectAll = () => {
    if (selectedItems.length === indicators.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(indicators.map(item => item.id));
    }
  };

  const handleItemSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    alert(`${selectedItems.length}개 항목을 완료로 표시했습니다.`);
    setSelectedItems([]);
  };

  const handleBulkExport = () => {
    alert(`${selectedItems.length}개 항목을 내보냈습니다.`);
    setSelectedItems([]);
  };

  const handleGuideClick = (type: string) => {
    if (type === 'concepts') {
      router.push('/basic/concepts');
    } else if (type === 'adoption') {
      router.push('/basic/adoption-status');
    }
  };

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || indicator.section === selectedSection;
    const matchesStatus = selectedStatus === 'all' || indicator.status === selectedStatus;
    
    return matchesSearch && matchesSection && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">지표 및 데이터 관리</h1>
        <p className="text-gray-600">
          IFRS S2 공시 지표들의 데이터 입력 현황을 관리하고 모니터링하세요.
        </p>
      </div>

      {/* 검색 및 필터링 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">검색 및 필터링</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지표명/코드 검색
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="S2-1, 온실가스 배출량..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              섹션
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 섹션</option>
              <option value="지배구조">지배구조</option>
              <option value="전략">전략</option>
              <option value="위험관리">위험관리</option>
              <option value="지표 및 목표">지표 및 목표</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 상태</option>
              <option value="completed">완료</option>
              <option value="in_progress">작성 중</option>
              <option value="draft">초안</option>
              <option value="not_started">미작성</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSection('all');
                setSelectedStatus('all');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors duration-200"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 일괄 작업 도구 */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.length}개 항목이 선택됨
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkComplete}
                className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
              >
                선택 항목 완료로 표시
              </button>
              <button
                onClick={handleBulkExport}
                className="px-3 py-1 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded-md transition-colors duration-200"
              >
                선택 항목 내보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지표 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            IFRS S2 공시 지표 목록 ({filteredIndicators.length}개)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            백엔드 DB와 연동하여 실시간 데이터를 표시할 예정입니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === indicators.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  코드
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지표명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  섹션
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  진행률
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최종 수정일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  검증
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIndicators.map((indicator) => (
                <tr key={indicator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(indicator.id)}
                      onChange={() => handleItemSelect(indicator.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{indicator.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{indicator.title}</div>
                    <div className="text-sm text-gray-500">{indicator.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{indicator.section}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(indicator.progress)}`}
                          style={{ width: `${indicator.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{indicator.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(indicator.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indicator.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {indicator.hasIssues ? (
                      <div className="flex items-center text-red-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-xs">검토 필요</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs">정상</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 도움말 및 가이드라인 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">도움말 & 가이드라인</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleGuideClick('concepts')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">기후공시 개념 자세히 보기</h3>
              <p className="text-sm text-gray-500">IFRS S2 기후공시 표준의 핵심 개념과 원칙</p>
            </div>
          </button>

          <button
            onClick={() => handleGuideClick('adoption')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">ISSB 도입 현황 가이드</h3>
              <p className="text-sm text-gray-500">전 세계 각국의 IFRS S2 도입 현황과 일정</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}; 