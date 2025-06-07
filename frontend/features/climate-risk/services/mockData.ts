import { HeatwaveData } from '../types';
import { REGIONS } from '../constants';

// Mock 데이터 생성 함수
export const generateMockData = (region: string, scenario: string): HeatwaveData[] => {
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
export const generateMockRiskData = (scenario: string, year: string): { [regionName: string]: number } => {
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