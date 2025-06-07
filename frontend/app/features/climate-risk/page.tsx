'use client';

import { useState, useEffect } from 'react';
import ProvinceMap from '../../components/ProvinceMap';
import MunicipalityMap from '../../components/MunicipalityMap';

interface HeatwaveData {
  scenario: string;
  region: string;
  year: string;
  heatwave_days: number;
  change_days: number;
  change_rate: number;
}

interface RegionOption {
  value: string;
  label: string;
}

interface ProvinceInfo {
  name: string;
  bounds: any | null;
  code?: string;
}

const REGIONS: RegionOption[] = [
  { value: '서울특별시', label: '서울특별시' },
  { value: '부산광역시', label: '부산광역시' },
  { value: '대구광역시', label: '대구광역시' },
  { value: '인천광역시', label: '인천광역시' },
  { value: '광주광역시', label: '광주광역시' },
  { value: '대전광역시', label: '대전광역시' },
  { value: '울산광역시', label: '울산광역시' },
  { value: '세종특별자치시', label: '세종특별자치시' },
  { value: '경기도', label: '경기도' },
  { value: '강원특별자치도', label: '강원특별자치도' },
  { value: '충청북도', label: '충청북도' },
  { value: '충청남도', label: '충청남도' },
  { value: '전북특별자치도', label: '전북특별자치도' },
  { value: '전라남도', label: '전라남도' },
  { value: '경상북도', label: '경상북도' },
  { value: '경상남도', label: '경상남도' },
  { value: '제주특별자치도', label: '제주특별자치도' },
];

const SCENARIOS = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5'];

// 지도 지역명을 DB 지역명으로 매핑하는 함수
const mapRegionNameForDB = (geoJsonRegionName: string): string => {
  const regionMapping: { [key: string]: string } = {
    '강원도': '강원특별자치도',
    '전라북도': '전북특별자치도',
    '제주도': '제주특별자치도'
  };
  
  return regionMapping[geoJsonRegionName] || geoJsonRegionName;
};

// Mock 데이터 생성 함수
const generateMockData = (region: string, scenario: string): HeatwaveData[] => {
  return [
    {
      scenario: '현재기후',
      region: region,
      year: '현재기후',
      heatwave_days: 10.1,
      change_days: 0,
      change_rate: 0
    },
    {
      scenario: scenario,
      region: region,
      year: '2030',
      heatwave_days: 15.2,
      change_days: 5.1,
      change_rate: 50.3
    },
    {
      scenario: scenario,
      region: region,
      year: '2040',
      heatwave_days: 23.7,
      change_days: 13.6,
      change_rate: 134.7
    },
    {
      scenario: scenario,
      region: region,
      year: '2050',
      heatwave_days: 31.8,
      change_days: 21.7,
      change_rate: 214.9
    }
  ];
};

// 지도 색칠용 Mock 변화량 데이터 생성 함수
const generateMockRiskData = (scenario: string, year: string): { [regionName: string]: number } => {
  const mockRiskData: { [regionName: string]: number } = {};
  
  // 시나리오에 따른 기본 변화량 설정 (일수 기준)
  const baseChange = scenario === 'SSP5-8.5' ? 18 : scenario === 'SSP3-7.0' ? 14 : scenario === 'SSP2-4.5' ? 12 : 8;
  
  REGIONS.forEach(region => {
    // 지역별로 약간의 변동을 주어 현실적인 데이터 생성
    const variation = Math.random() * 8 - 4; // -4 ~ +4 범위의 변동
    mockRiskData[region.value] = Math.max(0, baseChange + variation);
  });
  
  return mockRiskData;
};

export default function ClimateRiskPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('서울특별시');
  const [selectedScenario, setSelectedScenario] = useState<string>('SSP2-4.5');
  const [heatwaveData, setHeatwaveData] = useState<HeatwaveData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);
  const [mapRiskData, setMapRiskData] = useState<{ [regionName: string]: number }>({});

  // 지도 상태를 통합된 객체로 관리 (code 필드 추가)
  const [provinceInfo, setProvinceInfo] = useState<ProvinceInfo>({
    name: '',
    bounds: null,
    code: undefined,
  });

  const fetchHeatwaveData = async () => {
    setLoading(true);
    setError(null);
    setIsUsingMockData(false);

    try {
      // 선택된 시나리오 데이터 조회
      const scenarioResponse = await fetch(
        `http://localhost:8087/api/heatwave/region/${selectedRegion}/scenario/${selectedScenario}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 현재기후 데이터 조회
      const currentClimateResponse = await fetch(
        `http://localhost:8087/api/heatwave/region/${selectedRegion}/scenario/현재기후`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!scenarioResponse.ok) {
        throw new Error(`HTTP error! status: ${scenarioResponse.status}`);
      }

      const scenarioData = await scenarioResponse.json();
      let allData = [...scenarioData.data];

      // 현재기후 데이터가 있으면 추가
      if (currentClimateResponse.ok) {
        const currentClimateData = await currentClimateResponse.json();
        if (currentClimateData.data && currentClimateData.data.length > 0) {
          // 현재기후 데이터를 맨 앞에 추가
          allData = [...currentClimateData.data, ...scenarioData.data];
        }
      }

      if (allData.length === 0) {
        throw new Error('No data available');
      }

      setHeatwaveData(allData);
      console.log('✅ 실시간 데이터 로드 성공:', allData);
      
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      console.log('🔄 Mock 데이터로 전환');
      
      // API 실패 시 Mock 데이터 사용
      setIsUsingMockData(true);
      const mockData = generateMockData(selectedRegion, selectedScenario);
      setHeatwaveData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatwaveData();
  }, [selectedRegion, selectedScenario]);

  // 지도 위험도 데이터 업데이트 (시나리오 변경 시)
  useEffect(() => {
    const fetchMapRiskData = async () => {
      try {
        console.log(`🗺️ 지도 위험도 데이터 조회: ${selectedScenario}`);
        
        const response = await fetch(
          `http://localhost:8087/api/heatwave/map/scenario/${selectedScenario}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('✅ 지도 위험도 API 응답:', result);
          
          if (result.data && result.data.length > 0) {
            // API 데이터를 지역명: 평균변화량 형태로 변환
            const riskDataMap: { [regionName: string]: number } = {};
            result.data.forEach((item: any) => {
              riskDataMap[item.region] = item.avg_change_amount || 0;
            });
            
            setMapRiskData(riskDataMap);
            console.log('✅ 실제 지도 변화량 데이터 적용:', riskDataMap);
            return;
          }
        }
        
        throw new Error('API 응답이 비어있음');
        
      } catch (error) {
        console.error('❌ 지도 위험도 API 실패:', error);
        console.log('🔄 Mock 지도 데이터로 전환');
        
        // API 실패 시 Mock 데이터 사용
        const mockRiskData = generateMockRiskData(selectedScenario, '2030');
        setMapRiskData(mockRiskData);
      }
    };

    fetchMapRiskData();
  }, [selectedScenario]);

  const getRiskLevel = (changeRate: number) => {
    if (changeRate >= 100) return { level: '매우 높음', color: 'text-red-600 bg-red-100' };
    if (changeRate >= 50) return { level: '높음', color: 'text-orange-600 bg-orange-100' };
    if (changeRate >= 20) return { level: '보통', color: 'text-yellow-600 bg-yellow-100' };
    return { level: '낮음', color: 'text-green-600 bg-green-100' };
  };

  // 지도에서 시도 선택 시 호출되는 함수 (통합된 단일 setState)
  const handleProvinceSelect = (name: string, bounds: any, code?: string) => {
    console.log('Province selected:', name, 'with code:', code);
    
    // 지도에서 클릭한 지역명을 DB 지역명으로 매핑
    const dbRegionName = mapRegionNameForDB(name);
    console.log('Mapped region name for DB:', dbRegionName);
    
    // 단일 setState로 React 배치 처리 최적화
    setProvinceInfo({ name, bounds, code });
    // 선택된 시도를 기후 데이터 지역으로도 설정 (DB 매핑된 이름 사용)
    setSelectedRegion(dbRegionName);
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
                onProvinceSelect={handleProvinceSelect}
                selectedProvince={provinceInfo.name}
                riskData={mapRiskData}
                scenario={selectedScenario}
                year="2030"
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

          {!loading && !error && heatwaveData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">해당 조건에 대한 데이터가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 정보 섹션 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">기후변화 시나리오 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>SSP1-2.6:</strong> 지속가능한 발전 시나리오 (온도상승 1.5°C)
            </div>
            <div>
              <strong>SSP2-4.5:</strong> 중간 수준의 기후변화 시나리오 (온도상승 2.7°C)
            </div>
            <div>
              <strong>SSP3-7.0:</strong> 지역별 경쟁 시나리오 (온도상승 3.6°C)
            </div>
            <div>
              <strong>SSP5-8.5:</strong> 화석연료 의존 시나리오 (온도상승 4.4°C)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 