'use client';

import React, { useState } from 'react';
import { IndustryType, FinancialImpactInput, FinancialImpactResult } from '../types';
import { INDUSTRY_TYPES, SCENARIO_TYPES, MOCK_REGIONS } from '../constants';

// Mock calculation function
const mockCalculateFinancialImpact = (input: FinancialImpactInput): FinancialImpactResult => {
  const heatwaveDays = MOCK_REGIONS.find(r => r.name === input.region)?.heatwaveDaysIncrease[input.scenario] || 0;
  let totalImpact = 0;
  const details = [];

  // Manufacturing calculation
  if (input.industryType === 'manufacturing' && input.manufacturing) {
    const {
      employeeCount,
      hourlyProductionValuePerPerson,
      workHourReductionPerDay,
      normalDailyPowerConsumptionKWh,
      powerConsumptionIncreaseRate,
      electricityUnitPrice,
      dailySupplyCostPerPerson
    } = input.manufacturing;

    const salesLoss = (employeeCount || 0) * (hourlyProductionValuePerPerson || 0) * (workHourReductionPerDay || 0) * heatwaveDays;
    details.push({ 
      category: '생산성 저하로 인한 생산 손실', 
      amount: salesLoss, 
      formula: '직원 수 × 시간당 생산 가치 × 작업 시간 감소 × 폭염 일수',
      explanation: '폭염으로 인한 근로자 생산성 저하로 생산량 감소 및 매출 손실이 발생합니다.' 
    }); 
    totalImpact += salesLoss;

    const additionalPowerCost = ((normalDailyPowerConsumptionKWh || 0) * ((powerConsumptionIncreaseRate || 0) / 100)) * (electricityUnitPrice || 0) * heatwaveDays;
    details.push({ 
      category: '전력비용 증가 (냉방 에너지)', 
      amount: additionalPowerCost, 
      formula: '(평상시 전력 사용량 × 증가율) × 전기 요금 × 폭염 일수',
      explanation: '폭염 시 냉방 및 장비 운영을 위한 추가 전력 소비로 전기료가 증가합니다.' 
    }); 
    totalImpact += additionalPowerCost;

    const supplyCost = (employeeCount || 0) * (dailySupplyCostPerPerson || 0) * heatwaveDays;
    details.push({ 
      category: '물품 지급비용 증가', 
      amount: supplyCost, 
      formula: '직원 수 × 1인당 일일 물품비용 × 폭염 일수',
      explanation: '근로자 안전을 위해 추가 보호장비 및 냉방용품을 지급해야 합니다.' 
    }); 
    totalImpact += supplyCost;
  }

  return { totalImpact, details };
};

const FinancialImpactLayout: React.FC = () => {
  const [industryType, setIndustryType] = useState<IndustryType | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [scenario, setScenario] = useState<'SSP1-2.6' | 'SSP5-8.5'>('SSP1-2.6');
  const [result, setResult] = useState<FinancialImpactResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicInputFields, setDynamicInputFields] = useState<any>({});

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustryType(e.target.value as IndustryType);
    setDynamicInputFields({});
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScenario(e.target.value as 'SSP1-2.6' | 'SSP5-8.5');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setDynamicInputFields(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleCalculate = async () => {
    if (!industryType || !region) {
      alert('산업 유형과 지역을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    const currentRegionData = MOCK_REGIONS.find(r => r.name === region);
    const heatwaveDays = currentRegionData?.heatwaveDaysIncrease[scenario] || 0;

    const finalInputData: FinancialImpactInput = {
        industryType: industryType!,
        region: region!,
        scenario: scenario!,
        heatwaveDaysIncrease: heatwaveDays,
        [industryType!]: dynamicInputFields
    };

    setTimeout(() => {
      const mockResult = mockCalculateFinancialImpact(finalInputData);
      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const renderIndustrySpecificInputs = () => {
    const commonClasses = "p-2 border border-gray-300 rounded-md w-full";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    const manufacturingFields = [
        { key: 'employeeCount', label: '직원 수' },
        { key: 'hourlyProductionValuePerPerson', label: '1인당 시간당 생산 가치 (원)' },
        { key: 'workHourReductionPerDay', label: '일일 작업시간 감소량 (시간)' },
        { key: 'normalDailyPowerConsumptionKWh', label: '평상시 일일 전력 소비량 (kWh)' },
        { key: 'powerConsumptionIncreaseRate', label: '전력 소비 증가율 (%)' },
        { key: 'electricityUnitPrice', label: '전기 단가 (원/kWh)' },
        { key: 'dailySupplyCostPerPerson', label: '1인당 일일 물품 지급비용 (원)' },
    ];

    let fieldsToRender: { key: string; label: string; }[] = [];
    if (industryType === 'manufacturing') fieldsToRender = manufacturingFields;

    return (
      <div className="space-y-4">
        {fieldsToRender.map((field) => (
          <div key={field.key}>
            <label className={labelClasses}>{field.label}</label>
            <input
              type="number"
              value={dynamicInputFields[field.key] || ''}
              onChange={(e) => handleInputChange(e, field.key)}
              className={commonClasses}
            />
          </div>
        ))}
      </div>
    );
  };

  const getHeatwaveDaysForSelectedRegion = () => {
    if (region && scenario) {
      const regionData = MOCK_REGIONS.find(r => r.name === region);
      return regionData?.heatwaveDaysIncrease[scenario] || 0;
    }
    return 0;
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Panel: Input Form */}
      <aside className="w-1/3 p-6 border-r border-gray-200 bg-white shadow-sm overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">재무영향 시뮬레이션 입력</h2>

        <div className="mb-6">
          <label htmlFor="industry-select" className="block text-sm font-medium text-gray-700 mb-1">
            산업 유형 선택
          </label>
          <select
            id="industry-select"
            className="p-2 border border-gray-300 rounded-md w-full"
            onChange={handleIndustryChange}
            value={industryType || ''}
          >
            <option value="">-- 산업 선택 --</option>
            {INDUSTRY_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {industryType && (
          <div className="mb-6">
            <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1">
              사업장 위치 선택
            </label>
            <select
              id="region-select"
              className="p-2 border border-gray-300 rounded-md w-full"
              onChange={handleRegionChange}
              value={region || ''}
            >
              <option value="">-- 지역 선택 --</option>
              {MOCK_REGIONS.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {region && (
          <div className="mb-6">
            <label htmlFor="scenario-select" className="block text-sm font-medium text-gray-700 mb-1">
              기후 시나리오 선택
            </label>
            <select
              id="scenario-select"
              className="p-2 border border-gray-300 rounded-md w-full"
              onChange={handleScenarioChange}
              value={scenario}
            >
              {SCENARIO_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              선택한 지역의 폭염일수 증가 ({scenario}): {getHeatwaveDaysForSelectedRegion()}일
            </p>
          </div>
        )}

        {industryType && region && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">세부 데이터 입력</h3>
            {renderIndustrySpecificInputs()}
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
          disabled={isLoading || !industryType || !region}
        >
          {isLoading ? '계산 중...' : '재무영향 계산하기'}
        </button>
      </aside>

      {/* Right Panel: Results and Visualization */}
      <main className="w-2/3 p-6 bg-white shadow-md overflow-y-auto relative">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-blue-600">재무영향을 계산하고 있습니다...</p>
                </div>
            </div>
        )}

        {result ? (
          <>
            <h2 className="text-2xl font-bold mb-4">재무영향 시뮬레이션 결과</h2>
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-xl font-semibold text-blue-800">
                총 잠재 재무영향: {result.totalImpact.toLocaleString()}원
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">카테고리별 세부 내역</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">카테고리</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">금액</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">계산 공식</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {result.details.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm text-gray-800">{item.category}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{item.amount.toLocaleString()}원</td>
                      <td className="py-2 px-4 text-sm text-gray-600 italic">{item.formula || 'N/A'}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">{item.explanation || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-3">시나리오 비교 및 시각화</h3>
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                <p className="text-md font-medium text-gray-700 mb-2">총 재무영향 구성</p>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
                    파이 차트 영역 (Recharts 라이브러리 필요)
                </div>
            </div>

            <button
              className="mt-6 w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors text-lg font-semibold"
              onClick={() => alert('TCFD 보고서 내보내기 기능은 추후 구현됩니다.')}
            >
              TCFD 보고서로 내보내기
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>왼쪽 패널에서 산업 유형과 지역을 선택하고 데이터를 입력하여 재무영향을 계산해주세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancialImpactLayout; 