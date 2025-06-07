export interface HeatwaveData {
  scenario: string;
  region: string;
  year: string;
  heatwave_days: number;
  change_days: number;
  change_rate: number;
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