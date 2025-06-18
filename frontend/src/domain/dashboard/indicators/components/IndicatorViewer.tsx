'use client';

import { IndicatorViewerProps } from '../types';
import { IndicatorTabs } from './IndicatorTabs';

export function IndicatorViewer({ data }: IndicatorViewerProps) {
  if (Object.keys(data).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-lg font-medium text-gray-600 mb-2">
          공시 지표 데이터를 불러오지 못했습니다.
        </div>
        <div className="text-sm text-gray-500">
          네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-800">IFRS S2 공시 지표 목록</h2>
        <p className="text-sm text-gray-600 mt-1">
          기후 관련 공시 지표를 섹션별로 확인하고 관리할 수 있습니다.
        </p>
      </div>
      <div className="p-6">
        <IndicatorTabs data={data} />
      </div>
    </div>
  );
} 