import { HeatwaveData } from '../types';

const API_BASE_URL = 'http://localhost:8087/api';

export const climateRiskApi = {
  // 폭염 데이터 조회 (시나리오별)
  async fetchHeatwaveData(region: string, scenario: string): Promise<HeatwaveData[]> {
    const scenarioResponse = await fetch(
      `${API_BASE_URL}/heatwave/region/${region}/scenario/${scenario}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const currentClimateResponse = await fetch(
      `${API_BASE_URL}/heatwave/region/${region}/scenario/현재기후`,
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

    return allData;
  },

  // 지도 위험도 데이터 조회
  async fetchMapRiskData(scenario: string): Promise<{ [regionName: string]: number }> {
    const response = await fetch(
      `${API_BASE_URL}/heatwave/map/scenario/${scenario}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('API 응답이 비어있음');
    }

    const result = await response.json();
    
    if (!result.data || result.data.length === 0) {
      throw new Error('API 응답이 비어있음');
    }

    // API 데이터를 지역명: 평균변화량 형태로 변환
    const riskDataMap: { [regionName: string]: number } = {};
    result.data.forEach((item: any) => {
      riskDataMap[item.region] = item.avg_change_amount || 0;
    });
    
    return riskDataMap;
  }
}; 