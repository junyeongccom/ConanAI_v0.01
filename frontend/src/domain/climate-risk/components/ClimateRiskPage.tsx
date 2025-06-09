"use client";

import React from 'react';
import ClimateRiskFilters from './ClimateRiskFilters';
import ClimateRiskMaps from './ClimateRiskMaps';
import ClimateRiskResults from './ClimateRiskResults';
import { useClimateRisk } from '../hooks/useClimateRisk';

interface ProvinceInfo {
  name: string;
  bounds: any;
  code?: string;
}

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

  // 지도에서 지역 선택 시 드롭다운도 연동
  const handleProvinceSelect = (newProvinceInfo: ProvinceInfo) => {
    console.log('🗺️ 지도에서 지역 선택:', newProvinceInfo.name);
    setProvinceInfo(newProvinceInfo);
    setSelectedRegion(newProvinceInfo.name); // 드롭다운도 연동
  };

  // 드롭다운에서 지역 선택 시 지도도 연동
  const handleRegionChange = (region: string) => {
    console.log('📋 드롭다운에서 지역 선택:', region);
    setSelectedRegion(region);
    // 지도 정보도 업데이트 (간단한 형태로)
    setProvinceInfo({
      name: region,
      bounds: null,
      code: undefined
    });
  };

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
        <ClimateRiskFilters
          selectedRegion={selectedRegion}
          selectedScenario={selectedScenario}
          onRegionChange={handleRegionChange}
          onScenarioChange={setSelectedScenario}
        />

        {/* 지도 섹션 */}
        <ClimateRiskMaps
          selectedScenario={selectedScenario}
          provinceInfo={provinceInfo}
          onProvinceSelect={handleProvinceSelect}
        />

        {/* 결과 섹션 */}
        <ClimateRiskResults
          selectedRegion={selectedRegion}
          selectedScenario={selectedScenario}
          heatwaveData={heatwaveData}
          loading={loading}
          error={error}
          isUsingMockData={isUsingMockData}
          onRetry={fetchHeatwaveData}
        />
      </div>
    </div>
  );
} 