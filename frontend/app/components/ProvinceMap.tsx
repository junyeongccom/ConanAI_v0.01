'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Leaflet CSS import
import 'leaflet/dist/leaflet.css';

// SSR 환경에서 window 객체 체크
const isClient = typeof window !== 'undefined';

// Fix for default markers in react-leaflet (클라이언트에서만 실행)
if (isClient) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface ProvinceMapProps {
  onProvinceSelect?: (provinceName: string, provinceBounds: L.LatLngBounds, provinceCode?: string) => void;
  selectedProvince?: string;
  riskData?: { [regionName: string]: number }; // 지역별 위험도 데이터 (변화율)
  scenario?: string;
  year?: string;
}

// Dynamic import for react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.GeoJSON })), { ssr: false });

export default function ProvinceMap({ onProvinceSelect, selectedProvince, riskData, scenario, year }: ProvinceMapProps) {
  const [provincesData, setProvincesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const provinceLayerRef = useRef<L.GeoJSON | null>(null);

  // 지역명 매핑 함수 (GeoJSON 지역명 → DB 지역명)
  const mapRegionNameForDB = (geoJsonRegionName: string): string => {
    const regionMapping: { [key: string]: string } = {
      '강원도': '강원특별자치도',
      '전라북도': '전북특별자치도',
      '제주도': '제주특별자치도'
    };
    return regionMapping[geoJsonRegionName] || geoJsonRegionName;
  };

  // 변화량에 따른 색상 결정 함수
  const getRiskColor = (changeAmount: number): string => {
    if (changeAmount >= 21) return '#dc2626';  // 매우 높음 - 빨간색
    if (changeAmount >= 16) return '#ea580c';  // 높음 - 진한 주황색
    if (changeAmount >= 11) return '#f97316';  // 보통 - 주황색
    return '#fbbf24';                          // 낮음 - 연노란색
  };

  // 기본 색상 (위험도 데이터가 없을 때)
  const getDefaultColor = (isSelected: boolean): string => {
    return isSelected ? '#60a5fa' : '#9ec6ff';
  };

  useEffect(() => {
    const loadProvinceData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/maps/skorea-provinces-2018-geo.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProvincesData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading province data:', err);
        setError('시도 지도 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProvinceData();
  }, []);

  const onEachProvinceFeature = (feature: any, layer: L.Layer) => {
    if (!feature || !feature.properties) return;
    
    const provinceName = feature.properties.name;
    console.log('GeoJSON Province feature:', {
      name: provinceName,
      properties: feature.properties
    });
    
    layer.on({
      click: (e) => {
        e.originalEvent?.stopPropagation();
        
        console.log('Province clicked:', provinceName);
        console.log('Feature properties:', feature.properties);
        
        // bounds 가드: getBounds가 유효한지 확인
        if (onProvinceSelect && typeof (layer as any).getBounds === 'function') {
          try {
            const bounds = (layer as any).getBounds();
            
            // bounds가 유효한지 확인
            if (bounds && bounds.isValid && bounds.isValid()) {
              console.log('Province clicked with valid bounds:', provinceName);
              const provinceCode = feature.properties.code;
              onProvinceSelect(provinceName, bounds, provinceCode);
            } else {
              console.warn('Invalid bounds for province:', provinceName);
            }
          } catch (error) {
            console.error('Error getting bounds for province:', provinceName, error);
          }
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#1e40af',
          fillOpacity: 0.8,
          fillColor: '#60a5fa'
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        if (provinceLayerRef.current) {
          provinceLayerRef.current.resetStyle(e.target);
        }
      }
    });

    // Tooltip 바인딩
    layer.bindTooltip(provinceName, {
      permanent: false,
      direction: 'center',
      className: 'map-tooltip'
    });
  };

  const provinceStyle = (feature?: any) => {
    const isSelected = selectedProvince === feature?.properties?.name;
    const provinceName = feature?.properties?.name;
    
    // 위험도 데이터가 있는 경우
    if (riskData && provinceName) {
      const dbRegionName = mapRegionNameForDB(provinceName);
      const changeAmount = riskData[dbRegionName];
      
      if (changeAmount !== undefined) {
        const riskColor = getRiskColor(changeAmount);
        return {
          fillColor: riskColor,
          weight: isSelected ? 2 : 1,
          opacity: 1,
          color: isSelected ? '#1e40af' : '#374151',
          fillOpacity: 0.8
        };
      }
    }
    
    // 기본 스타일 (위험도 데이터가 없는 경우)
    return {
      fillColor: getDefaultColor(isSelected),
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: '#1e4fa3',
      fillOpacity: isSelected ? 0.8 : 0.6
    };
  };

  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">시도 지도 로딩 중...</p>
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

  if (!provincesData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <p className="text-gray-600 text-sm">지도 데이터 준비 중...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={`province-map-${selectedProvince}`}
        ref={handleMapCreated}
        center={[36.5, 127.5]}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        className="w-full h-full rounded-lg"
        style={{ 
          backgroundColor: '#f0f4ff',
          minHeight: '100%'
        }}
        maxBounds={[[32, 124], [39, 132]]}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        attributionControl={false}
      >
        {provincesData && (
          <GeoJSON
            key={`provinces-${selectedProvince}`}
            data={provincesData}
            style={provinceStyle}
            onEachFeature={onEachProvinceFeature}
            ref={provinceLayerRef}
          />
        )}
      </MapContainer>
      
      {/* 제목 표시 */}
      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
        시·도 선택
      </div>
    </div>
  );
} 