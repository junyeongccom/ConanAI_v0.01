export const FINANCIAL_IMPACT_API_BASE_URL = '/api/finimpact'; // Financial impact service endpoint routed through API Gateway
export const CLIMATE_API_BASE_URL = '/api/climate'; // Climate service endpoint

export const INDUSTRY_TYPES = [
  { value: 'manufacturing', label: '제조업' },
  { value: 'construction', label: '건설업' },
  { value: 'semiconductor', label: '반도체' },
] as const;

export const SCENARIO_TYPES = [
  { value: 'SSP1-2.6', label: 'SSP1-2.6 시나리오 (저탄소)' },
  { value: 'SSP5-8.5', label: 'SSP5-8.5 시나리오 (고탄소)' },
] as const;

// Regional data (currently mock data, will be fetched from climate-service later)
// Based on SK Hynix TCFD report domestic business site heatwave days increase trend data
export const MOCK_REGIONS = [
  { name: '서울', heatwaveDaysIncrease: { 'SSP1-2.6': 5, 'SSP5-8.5': 10 } }, // 서울 샘플 데이터
  { name: '이천', heatwaveDaysIncrease: { 'SSP1-2.6': 17.1, 'SSP5-8.5': 33.8 } }, // 2050년 기준
  { name: '청주', heatwaveDaysIncrease: { 'SSP1-2.6': 21.4, 'SSP5-8.5': 38.2 } }, // 2050년 기준
  { name: '용인', heatwaveDaysIncrease: { 'SSP1-2.6': 16.7, 'SSP5-8.5': 33.2 } }, // 2050년 기준
] as const; 