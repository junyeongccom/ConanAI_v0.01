import { useEffect } from 'react';
import { useClimateRiskStore } from '../store/useClimateRiskStore';
import { climateRiskApi } from '../services/api';
import { generateMockData, generateMockRiskData } from '../services/mockData';

export const useClimateRisk = () => {
  const {
    selectedRegion,
    selectedScenario,
    heatwaveData,
    mapRiskData,
    loading,
    error,
    isUsingMockData,
    provinceInfo,
    setSelectedRegion,
    setSelectedScenario,
    setHeatwaveData,
    setMapRiskData,
    setLoading,
    setError,
    setIsUsingMockData,
    setProvinceInfo,
  } = useClimateRiskStore();

  // 폭염 데이터 조회
  const fetchHeatwaveData = async () => {
    setLoading(true);
    setError(null);
    setIsUsingMockData(false);

    try {
      const data = await climateRiskApi.fetchHeatwaveData(selectedRegion, selectedScenario);
      setHeatwaveData(data);
      console.log('✅ 실시간 데이터 로드 성공:', data);
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

  // 지도 위험도 데이터 조회
  const fetchMapRiskData = async () => {
    try {
      console.log(`🗺️ 지도 위험도 데이터 조회: ${selectedScenario}`);
      
      const riskData = await climateRiskApi.fetchMapRiskData(selectedScenario);
      setMapRiskData(riskData);
      console.log('✅ 실제 지도 변화량 데이터 적용:', riskData);
    } catch (error) {
      console.error('❌ 지도 위험도 API 실패:', error);
      console.log('🔄 Mock 지도 데이터로 전환');
      
      // API 실패 시 Mock 데이터 사용
      const mockRiskData = generateMockRiskData(selectedScenario, '2030');
      setMapRiskData(mockRiskData);
    }
  };

  // 지역 변경 시 데이터 재조회
  useEffect(() => {
    fetchHeatwaveData();
  }, [selectedRegion, selectedScenario]);

  // 시나리오 변경 시 지도 데이터 재조회
  useEffect(() => {
    fetchMapRiskData();
  }, [selectedScenario]);

  return {
    // State
    selectedRegion,
    selectedScenario,
    heatwaveData,
    mapRiskData,
    loading,
    error,
    isUsingMockData,
    provinceInfo,
    
    // Actions
    setSelectedRegion,
    setSelectedScenario,
    setProvinceInfo,
    
    // Methods
    fetchHeatwaveData,
    fetchMapRiskData,
  };
}; 