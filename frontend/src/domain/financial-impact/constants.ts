export const FINANCIAL_IMPACT_API_BASE_URL = '/api/finimpact'; // Financial impact service endpoint routed through API Gateway
export const CLIMATE_API_BASE_URL = '/api/climate'; // Climate service endpoint

export const INDUSTRY_TYPES = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'construction', label: 'Construction' },
  { value: 'semiconductor', label: 'Semiconductor' },
] as const;

export const SCENARIO_TYPES = [
  { value: 'SSP1-2.6', label: 'SSP1-2.6 Scenario (Low Carbon)' },
  { value: 'SSP5-8.5', label: 'SSP5-8.5 Scenario (High Carbon)' },
] as const;

// Regional data (currently mock data, will be fetched from climate-service later)
// Based on SK Hynix TCFD report domestic business site heatwave days increase trend data
export const MOCK_REGIONS = [
  { name: 'Seoul', heatwaveDaysIncrease: { 'SSP1-2.6': 5, 'SSP5-8.5': 10 } }, // Seoul sample data
  { name: 'Icheon', heatwaveDaysIncrease: { 'SSP1-2.6': 17.1, 'SSP5-8.5': 33.8 } }, // Based on 2050
  { name: 'Cheongju', heatwaveDaysIncrease: { 'SSP1-2.6': 21.4, 'SSP5-8.5': 38.2 } }, // Based on 2050
  { name: 'Yongin', heatwaveDaysIncrease: { 'SSP1-2.6': 16.7, 'SSP5-8.5': 33.2 } }, // Based on 2050
] as const; 