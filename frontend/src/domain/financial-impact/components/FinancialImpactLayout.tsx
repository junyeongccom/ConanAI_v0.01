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
      category: 'Production Loss Due to Reduced Productivity', 
      amount: salesLoss, 
      formula: 'Employees × Hourly Production Value × Work Hour Reduction × Heatwave Days',
      explanation: 'Heatwaves reduce worker productivity leading to decreased production and revenue loss.' 
    }); 
    totalImpact += salesLoss;

    const additionalPowerCost = ((normalDailyPowerConsumptionKWh || 0) * ((powerConsumptionIncreaseRate || 0) / 100)) * (electricityUnitPrice || 0) * heatwaveDays;
    details.push({ 
      category: 'Increased Power Costs (Cooling Energy)', 
      amount: additionalPowerCost, 
      formula: '(Normal Power Usage × Increase Rate) × Electricity Price × Heatwave Days',
      explanation: 'Additional energy consumption for cooling and equipment during heatwaves increases electricity costs.' 
    }); 
    totalImpact += additionalPowerCost;

    const supplyCost = (employeeCount || 0) * (dailySupplyCostPerPerson || 0) * heatwaveDays;
    details.push({ 
      category: 'Increased Supply Costs', 
      amount: supplyCost, 
      formula: 'Employees × Daily Supply Cost per Person × Heatwave Days',
      explanation: 'Companies must provide additional protective equipment and cooling supplies for worker safety.' 
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
      alert('Please select industry type and region.');
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
        { key: 'employeeCount', label: 'Employee Count' },
        { key: 'hourlyProductionValuePerPerson', label: 'Hourly Production Value per Person (KRW)' },
        { key: 'workHourReductionPerDay', label: 'Work Hour Reduction per Day (hours)' },
        { key: 'normalDailyPowerConsumptionKWh', label: 'Normal Daily Power Consumption (kWh)' },
        { key: 'powerConsumptionIncreaseRate', label: 'Power Consumption Increase Rate (%)' },
        { key: 'electricityUnitPrice', label: 'Electricity Unit Price (KRW/kWh)' },
        { key: 'dailySupplyCostPerPerson', label: 'Daily Supply Cost per Person (KRW)' },
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
        <h2 className="text-2xl font-bold mb-6">Financial Impact Simulation Input</h2>

        <div className="mb-6">
          <label htmlFor="industry-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Industry Type
          </label>
          <select
            id="industry-select"
            className="p-2 border border-gray-300 rounded-md w-full"
            onChange={handleIndustryChange}
            value={industryType || ''}
          >
            <option value="">-- Select Industry --</option>
            {INDUSTRY_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {industryType && (
          <div className="mb-6">
            <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Business Location
            </label>
            <select
              id="region-select"
              className="p-2 border border-gray-300 rounded-md w-full"
              onChange={handleRegionChange}
              value={region || ''}
            >
              <option value="">-- Select Region --</option>
              {MOCK_REGIONS.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {region && (
          <div className="mb-6">
            <label htmlFor="scenario-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Climate Scenario
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
              Heatwave days increase for selected region ({scenario}): {getHeatwaveDaysForSelectedRegion()} days
            </p>
          </div>
        )}

        {industryType && region && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Data Input</h3>
            {renderIndustrySpecificInputs()}
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
          disabled={isLoading || !industryType || !region}
        >
          {isLoading ? 'Calculating...' : 'Calculate Financial Impact'}
        </button>
      </aside>

      {/* Right Panel: Results and Visualization */}
      <main className="w-2/3 p-6 bg-white shadow-md overflow-y-auto relative">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-blue-600">Calculating financial impact...</p>
                </div>
            </div>
        )}

        {result ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Financial Impact Simulation Results</h2>
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-xl font-semibold text-blue-800">
                Total Potential Financial Impact: {result.totalImpact.toLocaleString()} KRW
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">Detailed Breakdown by Category</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Formula</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.details.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm text-gray-800">{item.category}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{item.amount.toLocaleString()} KRW</td>
                      <td className="py-2 px-4 text-sm text-gray-600 italic">{item.formula || 'N/A'}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">{item.explanation || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-3">Scenario Comparison & Visualization</h3>
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                <p className="text-md font-medium text-gray-700 mb-2">Total Financial Impact Composition</p>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
                    Pie Chart Area (Recharts library required)
                </div>
            </div>

            <button
              className="mt-6 w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors text-lg font-semibold"
              onClick={() => alert('Export to TCFD report feature will be implemented later.')}
            >
              Export to TCFD Report
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Please select industry type and region from the left panel and input data to calculate financial impact.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancialImpactLayout; 