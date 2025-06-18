// 테이블용 폭염일수 데이터 (연도별 상세 데이터)
export interface HeatwaveData {
  scenario: string;
  region: string;
  year: string;
  heatwave_days: number;
  change_days: number;
  change_rate: number;
}

// 지도용 위험도 데이터 (지역별 평균 변화량)
export interface MapRiskData {
  region: string;
  avg_change_amount: number;
}

export interface MapRiskResponse {
  status: string;
  data: MapRiskData[];
  total_count: number;
}

export interface RegionOption {
  value: string;
  label: string;
}

export interface ProvinceInfo {
  name: string;
  bounds: any | null;
  code?: string;
} 