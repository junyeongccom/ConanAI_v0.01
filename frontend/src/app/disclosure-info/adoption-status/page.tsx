'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaGlobe, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

interface AdoptionStatus {
  id: number;
  country: string;
  region: string;
  adoption_status: string;
  effective_date: string | null;
  notes: string | null;
}

export default function AdoptionStatusPage() {
  const [adoptionData, setAdoptionData] = useState<AdoptionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdoptionStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/disclosure/disclosure-data/adoption-status');
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setAdoptionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'adopted':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_consideration':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'adopted':
        return '도입 완료';
      case 'planned':
        return '도입 예정';
      case 'under_consideration':
        return '검토 중';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
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
      <div className="min-h-screen bg-gray-50 py-12 px-4">
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
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
            ISSB S2 글로벌 도입 현황
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            전 세계 각 국가의 IFRS S2 기후공시 표준 도입 현황을 확인하세요. 
            조기 준비를 통해 글로벌 기준에 맞춘 경쟁력을 확보할 수 있습니다.
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FaGlobe className="text-green-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">도입 완료</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {adoptionData.filter(item => item.adoption_status.toLowerCase() === 'adopted').length}개국
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-yellow-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">도입 예정</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {adoptionData.filter(item => item.adoption_status.toLowerCase() === 'planned').length}개국
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-blue-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">검토 중</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {adoptionData.filter(item => item.adoption_status.toLowerCase() === 'under_consideration').length}개국
            </p>
          </div>
        </div>

        {/* 국가별 도입 현황 테이블 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">국가별 상세 현황</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    국가
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    도입 상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시행일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adoptionData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.adoption_status)}`}>
                        {getStatusText(item.adoption_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.effective_date || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            지금이 바로 준비할 때입니다
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            많은 국가들이 이미 IFRS S2를 도입했거나 도입을 계획하고 있습니다. 
            Sky-C와 함께 글로벌 기준에 맞춘 기후공시를 준비하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-md font-semibold transition-colors duration-300"
            >
              Sky-C 시작하기
            </Link>
            <Link 
              href="/disclosure-info/concepts"
              className="border border-white text-white hover:bg-white hover:text-blue-600 py-3 px-6 rounded-md font-semibold transition-colors duration-300"
            >
              기후공시 개념 알아보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 