'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaGlobe, FaCalendarAlt, FaInfoCircle, FaMap, FaTable } from 'react-icons/fa';
import WorldAdoptionMap from '../../../../shared/components/visualization/WorldAdoptionMap';

interface AdoptionStatus {
  id: number;
  country: string;
  region: string;
  adoption_status: string;
  effective_date: string | null;
  notes: string | null;
}

export const AdoptionStatusLayout: React.FC = () => {
  const [adoptionData, setAdoptionData] = useState<AdoptionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
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

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
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

  const getStatusText = (status: string | null | undefined) => {
    if (!status) return '정보 없음';
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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">데이터를 로드하는 중...</p>
            </div>
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
            ISSB S2 글로벌 도입 현황
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            전 세계 각 국가의 IFRS S2 기후공시 표준 도입 현황을 지도와 표를 통해 확인하세요. 
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
              {adoptionData.filter(item => item.adoption_status?.toLowerCase() === 'adopted').length}개국
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-yellow-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">도입 예정</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {adoptionData.filter(item => item.adoption_status?.toLowerCase() === 'planned').length}개국
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-blue-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold">검토 중</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {adoptionData.filter(item => item.adoption_status?.toLowerCase() === 'under_consideration').length}개국
            </p>
          </div>
        </div>

        {/* 보기 모드 전환 버튼 */}
        <div className="mb-6">
          <div className="flex items-center justify-center bg-white rounded-lg shadow-md p-1 w-fit mx-auto">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                viewMode === 'map'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <FaMap className="text-sm" />
              지도 보기
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <FaTable className="text-sm" />
              표 보기
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        {viewMode === 'map' ? (
          // 지도 보기
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">세계 지도로 보는 ISSB 도입 현황</h2>
              {isClient ? (
                <WorldAdoptionMap adoptionData={adoptionData} />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">지도를 준비하는 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 표 보기
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">국가별 도입 현황 상세 정보</h2>
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
                          {item.effective_date ? new Date(item.effective_date).toLocaleDateString('ko-KR') : '-'}
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
          </div>
        )}

        {/* CTA 섹션 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            이제 Sky-C로 기후공시를 시작해보세요
          </h2>
          <p className="mb-6 text-blue-100">
            글로벌 트렌드에 맞춰 조기에 준비하면 경쟁 우위를 확보할 수 있습니다.
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