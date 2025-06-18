import { create } from 'zustand';
import { HeatwaveData, ProvinceInfo } from '../models/types';

interface ClimateRiskState {
  // 선택된 값들
  selectedRegion: string;
  selectedScenario: string;
  
  // 데이터
  heatwaveData: HeatwaveData[];
  mapRiskData: { [regionName: string]: number };
  
  // 상태
  loading: boolean;
  error: string | null;
  isUsingMockData: boolean;
  
  // 지도 상태
  provinceInfo: ProvinceInfo;
  
  // Actions
  setSelectedRegion: (region: string) => void;
  setSelectedScenario: (scenario: string) => void;
  setHeatwaveData: (data: HeatwaveData[]) => void;
  setMapRiskData: (data: { [regionName: string]: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsUsingMockData: (isUsingMockData: boolean) => void;
  setProvinceInfo: (provinceInfo: ProvinceInfo) => void;
}

export const useClimateRiskStore = create<ClimateRiskState>((set) => ({
  // Initial state
  selectedRegion: '서울특별시',
  selectedScenario: 'SSP2-4.5',
  heatwaveData: [],
  mapRiskData: {},
  loading: false,
  error: null,
  isUsingMockData: false,
  provinceInfo: {
    name: '',
    bounds: null,
    code: undefined,
  },
  
  // Actions
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setHeatwaveData: (data) => set({ heatwaveData: data }),
  setMapRiskData: (data) => set({ mapRiskData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setIsUsingMockData: (isUsingMockData) => set({ isUsingMockData }),
  setProvinceInfo: (provinceInfo) => set({ provinceInfo }),
})); 