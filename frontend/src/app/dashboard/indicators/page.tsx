'use client';

import { useEffect, useState } from 'react';
import { getStructuredIndicators } from '@/domain/dashboard/indicators/services/indicatorAPI';
import { IndicatorViewer } from '@/domain/dashboard/indicators/components/IndicatorViewer';
import { StructuredIndicators } from '@/domain/dashboard/indicators/types';

export default function IndicatorsPage() {
  const [indicatorData, setIndicatorData] = useState<StructuredIndicators>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStructuredIndicators();
        setIndicatorData(data);
      } catch (error) {
        console.error('Failed to load indicator data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">IFRS S2 공시 지표 및 데이터 관리</h1>
          <p className="text-gray-600">
            기후 관련 공시 지표 및 데이터를 체계적으로 관리하고 입력할 수 있습니다.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">공시 지표 데이터를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">IFRS S2 공시 지표 관리</h1>
        <p className="text-gray-600">
          기후 관련 공시 지표를 체계적으로 관리하고 입력할 수 있습니다.
        </p>
      </div>
      <IndicatorViewer data={indicatorData} />
    </div>
  );
} 