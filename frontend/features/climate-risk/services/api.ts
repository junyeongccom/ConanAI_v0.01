import { HeatwaveData } from '../types';

const API_BASE_URL = 'http://localhost:8087/api';

// 지역명 매핑 테이블 - GeoJSON 이름 → 백엔드 API 이름
const REGION_NAME_MAP: { [key: string]: string } = {
  '서울특별시': '서울특별시',
  '부산광역시': '부산광역시', 
  '대구광역시': '대구광역시',
  '인천광역시': '인천광역시',
  '광주광역시': '광주광역시',
  '대전광역시': '대전광역시',
  '울산광역시': '울산광역시',
  '세종특별자치시': '세종특별자치시',
  '경기도': '경기도',
  '강원도': '강원특별자치도',
  '충청북도': '충청북도',
  '충청남도': '충청남도',
  '전라북도': '전북특별자치도',
  '전라남도': '전라남도',
  '경상북도': '경상북도',
  '경상남도': '경상남도',
  '제주특별자치도': '제주특별자치도'
};

// 지역명 매핑 함수
const getBackendRegionName = (geoJsonName: string): string => {
  return REGION_NAME_MAP[geoJsonName] || geoJsonName;
};

export const climateRiskApi = {
  // 폭염 데이터 조회 (시나리오별)
  async fetchHeatwaveData(region: string, scenario: string): Promise<HeatwaveData[]> {
    // 지역명을 백엔드 API 형식으로 변환
    const backendRegionName = getBackendRegionName(region);
    
    const scenarioResponse = await fetch(
      `${API_BASE_URL}/heatwave/region/${backendRegionName}/scenario/${scenario}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const currentClimateResponse = await fetch(
      `${API_BASE_URL}/heatwave/region/${backendRegionName}/scenario/현재기후`,
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

  // 지도 위험도 데이터 조회 (수정된 버전)
  async fetchMapRisk(scenario: string): Promise<Array<{ region: string; avg_change_amount: number }>> {
    // 시나리오를 대문자로 변환
    const normalizedScenario = scenario.toUpperCase();
    
    const response = await fetch(
      `${API_BASE_URL}/heatwave/map/scenario/${normalizedScenario}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const result = await response.json();
    
    // { status, data: [...], total_count } 형태에서 data 배열만 추출
    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
      throw new Error('API 응답 데이터가 비어있음');
    }

    return result.data;
  }
}; 