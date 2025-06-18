"use client";

import React from 'react';
import ProvinceMap from './ProvinceMap';
import MunicipalityMap from './MunicipalityMap';
import ClimateRiskLegend from './ClimateRiskLegend';
import { ProvinceInfo } from '../models/types';

interface ClimateRiskMapsProps {
  selectedScenario: string;
  provinceInfo: ProvinceInfo;
  onProvinceSelect: (provinceInfo: ProvinceInfo) => void;
}

export default function ClimateRiskMaps({
  selectedScenario,
  provinceInfo,
  onProvinceSelect
}: ClimateRiskMapsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full min-h-[850px]">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        인터랙티브 지도
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        좌측에서 시·도를 선택하면 우측에 해당 지역의 시·군·구가 표시됩니다.
        지도 색상은 {selectedScenario} 시나리오 2030~2050년 평균 폭염일수 변화량을 나타냅니다.
      </p>
      
      <ClimateRiskLegend />
      
      {/* 반응형 2분할 레이아웃 */}
      <div className="flex flex-col gap-4 sm:flex-row h-[700px]">
        {/* 좌측: 시도 지도 */}
        <div className="flex-1 min-h-0">
          <ProvinceMap 
            selectedScenario={selectedScenario}
            onProvinceSelect={onProvinceSelect} 
          />
        </div>
        
        {/* 우측: 시군구 지도 */}
        <div className="flex-1 min-h-0">
          <MunicipalityMap provinceInfo={provinceInfo} />
        </div>
      </div>
    </div>
  );
} 