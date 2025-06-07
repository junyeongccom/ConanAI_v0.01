"use client";

import React from 'react';
import ProvinceMap from '../../features/climate-risk/components/ProvinceMap';
import MunicipalityMap from '../../features/climate-risk/components/MunicipalityMap';
import { useClimateRisk } from '../../features/climate-risk/hooks/useClimateRisk';
import { REGIONS, SCENARIOS } from '../../features/climate-risk/constants';
import { getRiskLevel } from '../../features/climate-risk/services/utils';

export default function ClimateRiskPage() {
  const {
    selectedRegion,
    selectedScenario,
    heatwaveData,
    loading,
    error,
    isUsingMockData,
    provinceInfo,
    setSelectedRegion,
    setSelectedScenario,
    setProvinceInfo,
    fetchHeatwaveData,
  } = useClimateRisk();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            지역별 기후리스크 평가
          </h1>
          <p className="text-lg text-gray-600">
            기후변화 시나리오별 폭염일수 변화를 통한 지역별 기후리스크를 평가합니다
          </p>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 선택
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기후변화 시나리오
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SCENARIOS.map((scenario) => (
                  <option key={scenario} value={scenario}>
                    {scenario}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 지도 섹션 - 2분할 레이아웃 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 w-full h-[750px]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            인터랙티브 지도
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            좌측에서 시·도를 선택하면 우측에 해당 지역의 시·군·구가 표시됩니다.
            지도 색상은 {selectedScenario} 시나리오 2030~2050년 평균 폭염일수 변화량을 나타냅니다.
          </p>
          
          {/* 위험도 범례 */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="font-medium text-gray-700">폭염일수 변화량:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span>낮음 (0-10일)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span>보통 (11-15일)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
              <span>높음 (16-20일)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span>매우 높음 (21일+)</span>
            </div>
          </div>
          
          {/* 반응형 2분할 레이아웃 */}
          <div className="flex flex-col gap-4 sm:flex-row h-[650px]">
            {/* 좌측: 시도 지도 */}
            <div className="flex-1 min-h-0">
              <ProvinceMap
                onProvinceSelect={setProvinceInfo}
              />
            </div>
            
            {/* 우측: 시군구 지도 */}
            <div className="flex-1 min-h-0">
              <MunicipalityMap 
                provinceInfo={provinceInfo}
              />
            </div>
          </div>
        </div>

        {/* 결과 섹션 */}
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

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchHeatwaveData}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && !error && heatwaveData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연도
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      폭염일수 (일)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      변화량 (일)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      변화율 (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      위험도
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {heatwaveData.map((item, index) => {
                    const risk = getRiskLevel(item.change_rate);
                    const isCurrentClimate = item.year === '현재기후';
                    
                    return (
                      <tr key={index} className={`hover:bg-gray-50 ${isCurrentClimate ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {isCurrentClimate ? '현재기후 (기준)' : item.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.heatwave_days.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {isCurrentClimate ? '-' : `+${item.change_days.toFixed(1)}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {isCurrentClimate ? '-' : `+${item.change_rate.toFixed(1)}%`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCurrentClimate ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              기준값
                            </span>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${risk.color}`}>
                              {risk.level}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 