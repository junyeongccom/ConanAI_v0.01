"use client";

import React from 'react';
import ClimateRiskTable from './ClimateRiskTable';
import { HeatwaveData } from '../types';

interface ClimateRiskResultsProps {
  selectedRegion: string;
  selectedScenario: string;
  heatwaveData: HeatwaveData[];
  loading: boolean;
  error: string | null;
  isUsingMockData: boolean;
  onRetry: () => void;
}

export default function ClimateRiskResults({
  selectedRegion,
  selectedScenario,
  heatwaveData,
  loading,
  error,
  isUsingMockData,
  onRetry
}: ClimateRiskResultsProps) {
  // 시나리오별 설명
  const getScenarioDescription = (scenario: string) => {
    const descriptions: { [key: string]: string } = {
      'SSP1-2.6': '지속가능한 발전 경로로, 2050년경 탄소중립을 달성하고 21세기 말 지구 평균기온이 1.4°C 상승하는 저배출 시나리오입니다.',
      'SSP2-4.5': '현재 정책이 지속되는 중간 경로로, 21세기 말 지구 평균기온이 2.7°C 상승하는 중배출 시나리오입니다.',
      'SSP3-7.0': '지역 간 경쟁이 심화되고 기후정책이 미흡한 경로로, 21세기 말 지구 평균기온이 3.6°C 상승하는 고배출 시나리오입니다.',
      'SSP5-8.5': '화석연료 의존도가 높은 경제발전 경로로, 21세기 말 지구 평균기온이 4.4°C 상승하는 최고배출 시나리오입니다.'
    };
    return descriptions[scenario] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedRegion} - {selectedScenario} 시나리오 분석 결과
        </h2>
        {isUsingMockData && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            🔧 데모 데이터
          </div>
        )}
        {!isUsingMockData && !loading && heatwaveData.length > 0 && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            ✅ 실시간 데이터
          </div>
        )}
      </div>

      {/* 시나리오 설명 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">{selectedScenario} 시나리오</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          {getScenarioDescription(selectedScenario)}
        </p>
      </div>

      <ClimateRiskTable
        heatwaveData={heatwaveData}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />

      {/* 데이터 출처 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium text-gray-700">데이터 출처:</span> 본 분석은 
              <span className="font-semibold text-blue-600"> 기상청 기후정보포털</span>의 
              <span className="font-semibold"> 기후변화 상황지도</span> 데이터를 기반으로 하며, 
              IPCC AR6 시나리오에 따른 과학적 기후변화 전망 정보를 활용하여 제공됩니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * 폭염일수는 일 최고기온이 33°C 이상인 날의 연간 일수를 의미합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 