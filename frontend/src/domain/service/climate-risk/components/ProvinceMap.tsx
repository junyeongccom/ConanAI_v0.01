'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { MapRiskResponse, MapRiskData } from '../models/types';
import { climateRiskApi } from '../services/api';

// Leaflet 컴포넌트들을 동적 import
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

// Leaflet CSS 및 아이콘 설정
import 'leaflet/dist/leaflet.css';

// 기본 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface ProvinceInfo {
  name: string;
  bounds: L.LatLngBounds | null;
  code?: string;
}

interface ProvinceMapProps {
  selectedScenario: string;
  onProvinceSelect: (provinceInfo: ProvinceInfo) => void;
}

export default function ProvinceMap({ selectedScenario, onProvinceSelect }: ProvinceMapProps) {
  const [provincesData, setProvincesData] = useState<any>(null);
  const [riskData, setRiskData] = useState<MapRiskData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 위험도에 따른 색상 반환 (사용자 요청에 따라 조정)
  const getRiskColor = (changeAmount: number): string => {
    if (changeAmount >= 21) return '#dc2626'; // 매우 높음 (21일+)
    if (changeAmount >= 16) return '#ea580c'; // 높음 (16-20일)
    if (changeAmount >= 11) return '#fbbf24'; // 보통 (11-15일) - 기존 낮음 색상 사용
    return '#fef3c7'; // 낮음 (0-10일) - 더 옅은 노란색
  };

  // 위험도 레벨 텍스트 반환
  const getRiskLevel = (changeAmount: number): string => {
    if (changeAmount >= 21) return '매우 높음';
    if (changeAmount >= 16) return '높음';
    if (changeAmount >= 11) return '보통';
    return '낮음';
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
                 // 지도 데이터 로드
         const geoResponse = await fetch('/maps/skorea-provinces-2018-geo.json');
        if (!geoResponse.ok) {
          throw new Error('지도 데이터를 불러올 수 없습니다.');
        }
        const geoData = await geoResponse.json();
        setProvincesData(geoData);

                 // 위험도 데이터 로드 시도 (수정된 버전)
         console.log('=== API 호출 ===');
         console.log('선택된 시나리오:', selectedScenario);
        
        // API 헬퍼 함수 사용
        const riskDataArray = await climateRiskApi.fetchMapRisk(selectedScenario);
        console.log('✅ API 응답 성공:', riskDataArray.length, '개 지역');
        
        // res.data.data 배열을 riskData 상태에 저장
        setRiskData(riskDataArray);
        console.log('📊 데이터 설정 완료:', riskDataArray.length, '개 지역');

      } catch (err) {
        console.error('데이터 로드 에러:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedScenario]);

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

  const geoJsonStyle = (feature: any) => {
    if (!feature || !riskData) {
      return { fillColor: '#gray', weight: 1, opacity: 1, color: '#666', fillOpacity: 0.5 };
    }
    
    // riskData는 이미 MapRiskData[] 타입
    const riskArray = riskData || [];
    
    // 다양한 속성명으로 지역명 찾기
    const provinceName = feature.properties.CTP_KOR_NM || 
                        feature.properties.prov_name || 
                        feature.properties.name || 
                        feature.properties.sido ||
                        feature.properties.CTPRVN_CD ||
                        'Unknown';
    
    // 지역명 매핑
    const backendRegionName = getBackendRegionName(provinceName);
    
    // 매핑된 이름으로 데이터 찾기
    const riskInfo = riskArray.find((item: MapRiskData) => item.region === backendRegionName);
    
    // 매칭 실패 시 디버깅 로그 (개발 환경에서만)
    if (!riskInfo && process.env.NODE_ENV === 'development') {
      console.log(`❌ 매칭 실패: "${provinceName}" → "${backendRegionName}"`);
      console.log('백엔드 지역들:', riskArray.map(item => item.region));
    }
    
    const changeAmount = riskInfo ? riskInfo.avg_change_amount : 0;
    const color = getRiskColor(changeAmount);
    
    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (!riskData) return;
    
    // 다양한 속성명으로 지역명 찾기
    const provinceName = feature.properties.CTP_KOR_NM || 
                        feature.properties.prov_name || 
                        feature.properties.name || 
                        feature.properties.sido ||
                        feature.properties.CTPRVN_CD ||
                        'Unknown';
    
    // riskData는 이미 MapRiskData[] 타입
    const riskArray = riskData || [];
    
    // 지역명 매핑
    const backendRegionName = getBackendRegionName(provinceName);
    
    // 매핑된 이름으로 데이터 찾기
    const riskInfo = riskArray.find((item: MapRiskData) => item.region === backendRegionName);
    
    const changeAmount = riskInfo ? riskInfo.avg_change_amount : 0;
    const riskLevel = getRiskLevel(changeAmount);
    
    layer.on({
      mouseover: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          weight: 3,
          fillOpacity: 0.8
        });
        targetLayer.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(geoJsonStyle(feature));
      },
      click: (e) => {
        const bounds = e.target.getBounds();
        const provinceCode = feature.properties.code;
        
        onProvinceSelect({
          name: provinceName,
          bounds: bounds,
          code: provinceCode
        });
      }
    });

    // Tooltip 바인딩
    layer.bindTooltip(
      `<div style="font-family: 'Pretendard', sans-serif;">
        <strong>${provinceName}</strong><br/>
        폭염일수 증가: <strong>${changeAmount.toFixed(1)}일</strong><br/>
        위험도: <strong style="color: ${getRiskColor(changeAmount)}">${riskLevel}</strong>
      </div>`,
      {
        permanent: false,
        direction: 'top',
        className: 'map-tooltip'
      }
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">지도 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 개발 환경에서만 렌더링 상태 확인
  if (process.env.NODE_ENV === 'development') {
    console.log('🗺️ 렌더링 상태:', {
      provincesData: !!provincesData,
      riskData: !!riskData,
      riskDataLength: riskData?.length || 0,
      scenario: selectedScenario
    });
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={`province-map-${selectedScenario}`}
        center={[36.5, 127.5]}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        className="w-full h-full rounded-lg"
        style={{ 
          backgroundColor: '#f0f4ff',
          minHeight: '100%'
        }}
        zoomControl={true}
        attributionControl={false}
      >
        {provincesData && riskData && (
          <GeoJSON
            key={`geojson-${selectedScenario}-${JSON.stringify(riskData).slice(0, 50)}`}
            data={provincesData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      
      {/* 제목 표시 */}
      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
        시·도별 기후위험도
      </div>
      
      {/* 디버깅 정보 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-10">
          <div>Provinces: {!!provincesData ? '✓' : '✗'}</div>
          <div>Risk Data: {!!riskData ? '✓' : '✗'}</div>
          <div>Risk Count: {riskData?.length || 0}</div>
          <div>Scenario: {selectedScenario}</div>
        </div>
      )}
    </div>
  );
} 