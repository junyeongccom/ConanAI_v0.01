"use client";

import React from 'react';
import { REGIONS, SCENARIOS } from '../models/constants';

interface ClimateRiskFiltersProps {
  selectedRegion: string;
  selectedScenario: string;
  onRegionChange: (region: string) => void;
  onScenarioChange: (scenario: string) => void;
}

export default function ClimateRiskFilters({
  selectedRegion,
  selectedScenario,
  onRegionChange,
  onScenarioChange
}: ClimateRiskFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지역 선택
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
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
            onChange={(e) => onScenarioChange(e.target.value)}
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
  );
} 