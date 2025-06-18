'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSearch, FaLightbulb, FaTags } from 'react-icons/fa';

interface Concept {
  id: number;
  concept_name: string;
  category: string;
  definition: string;
  examples: string | null;
}

export const ConceptsLayout: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/disclosure/disclosure-data/concepts');
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setConcepts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchConcepts();
  }, []);

  // 필터링된 개념들
  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.concept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 카테고리 목록 추출
  const categories = ['all', ...Array.from(new Set(concepts.map(concept => concept.category)))];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Physical Risk': 'bg-red-100 text-red-800',
      'Transition Risk': 'bg-blue-100 text-blue-800',
      'Climate Opportunity': 'bg-green-100 text-green-800',
      'Metrics & Targets': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            홈페이지로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            기후공시 핵심 개념
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            IFRS S2 기후공시 표준의 핵심 개념들을 이해하고, 
            체계적인 기후 관련 재무 정보 공시를 준비하세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="개념명 또는 정의로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 카테고리</option>
                {categories.slice(1).map((category, index) => (
                  <option key={`category-option-${index}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <FaLightbulb className="text-blue-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{concepts.length}</div>
            <div className="text-sm text-gray-600">전체 개념</div>
          </div>
          {categories.slice(1).map((category, index) => (
            <div key={`category-stats-${index}`} className="bg-white p-4 rounded-lg shadow-md text-center">
              <FaTags className="text-gray-500 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {concepts.filter(c => c.category === category).length}
              </div>
              <div className="text-sm text-gray-600">{category}</div>
            </div>
          ))}
        </div>

        {/* 개념 카드 목록 */}
        <div className="space-y-6">
          {filteredConcepts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">검색 결과가 없습니다.</div>
            </div>
          ) : (
            filteredConcepts.map((concept, index) => (
              <div key={`concept-${concept.id || index}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {concept.concept_name}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(concept.category)}`}>
                      {concept.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {concept.definition}
                  </p>
                  {concept.examples && (
                    <div className="bg-gray-50 rounded-md p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">예시:</h4>
                      <p className="text-sm text-gray-600">
                        {concept.examples}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA 섹션 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            이제 Sky-C로 실제 공시를 시작해보세요
          </h2>
          <p className="mb-6 text-blue-100">
            핵심 개념을 이해했다면, 이제 실제 데이터를 입력하고 보고서를 생성해보세요.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}; 