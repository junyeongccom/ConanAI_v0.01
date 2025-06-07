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

interface ProvinceInfo {
  name: string;
  bounds: L.LatLngBounds | null;
  code?: string;
}

interface ProvinceMapProps {
  onProvinceSelect: (provinceInfo: ProvinceInfo) => void;
}

// Dynamic import for react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });

export default function ProvinceMap({ onProvinceSelect }: ProvinceMapProps) {
  const [provincesData, setProvincesData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('ssp245');
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  // 위험도에 따른 색상 반환
  const getRiskColor = (changeAmount: number): string => {
    if (changeAmount <= 10) return '#fbbf24'; // 낮음 - 연노란색
    if (changeAmount <= 15) return '#fed7aa'; // 보통 - 연한 주황색  
    if (changeAmount <= 20) return '#ea580c'; // 높음 - 진한 주황색
    return '#dc2626'; // 매우 높음 - 빨간색
  };

  // 위험도 레벨 반환
  const getRiskLevel = (changeAmount: number): string => {
    if (changeAmount <= 10) return '낮음';
    if (changeAmount <= 15) return '보통';
    if (changeAmount <= 20) return '높음';
    return '매우 높음';
  };

  // 지도 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 지도 데이터와 위험도 데이터를 병렬로 로드
        const [mapResponse, riskResponse] = await Promise.all([
          fetch('/maps/skorea-provinces-2018-geo.json'),
          fetch(`http://localhost:3002/api/heatwave/map/scenario/${selectedScenario}`)
        ]);

        if (!mapResponse.ok) {
          throw new Error(`지도 데이터 로드 실패: ${mapResponse.status}`);
        }
        if (!riskResponse.ok) {
          throw new Error(`위험도 데이터 로드 실패: ${riskResponse.status}`);
        }

        const mapData = await mapResponse.json();
        const riskData = await riskResponse.json();
        
        setProvincesData(mapData);
        setRiskData(riskData);
        setError(null);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError('데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedScenario]);

  // 지도 레이어 업데이트
  useEffect(() => {
    if (!provincesData || !riskData || !mapRef.current) return;

    const map = mapRef.current;

    // 기존 레이어 제거
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // 새 레이어 생성
    const newLayer = L.geoJSON(provincesData, {
      style: (feature) => {
        if (!feature) return { fillColor: '#gray', weight: 1, opacity: 1, color: '#666', fillOpacity: 0.5 };
        
        const provinceName = feature.properties.prov_name || feature.properties.name;
        const riskInfo = riskData.find((item: any) => item.province === provinceName);
        const changeAmount = riskInfo ? riskInfo.change_amount : 0;
        
        return {
          fillColor: getRiskColor(changeAmount),
          weight: 2,
          opacity: 1,
          color: '#666',
          fillOpacity: 0.7
        };
      },
      onEachFeature: (feature, layer) => {
        const provinceName = feature.properties.prov_name || feature.properties.name;
        const riskInfo = riskData.find((item: any) => item.province === provinceName);
        const changeAmount = riskInfo ? riskInfo.change_amount : 0;
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
            if (newLayer) {
              newLayer.resetStyle(e.target);
            }
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
      }
    }).addTo(map);

    layerRef.current = newLayer;

    // 한국 전체 영역으로 뷰 설정
    map.fitBounds(newLayer.getBounds(), { padding: [20, 20] });

  }, [provincesData, riskData, onProvinceSelect]);

  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
    console.log('Province map created');
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

  return (
    <div className="relative w-full h-full">
      {/* 시나리오 선택 */}
      <div className="absolute top-2 left-2 z-10 bg-white/90 rounded-lg p-2 shadow-md">
        <select
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ssp245">SSP2-4.5 (중간 시나리오)</option>
          <option value="ssp585">SSP5-8.5 (고배출 시나리오)</option>
        </select>
      </div>

      {/* 범례 */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 rounded-lg p-3 shadow-md">
        <div className="text-xs font-semibold mb-2">폭염일수 증가 (일)</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
            <span className="text-xs">낮음 (0-10일)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
            <span className="text-xs">보통 (11-15일)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
            <span className="text-xs">높음 (16-20일)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span className="text-xs">매우 높음 (21일+)</span>
          </div>
        </div>
      </div>

      <MapContainer
        key={`province-map-${selectedScenario}`}
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
        zoomControl={true}
        attributionControl={false}
      >
        {/* 레이어는 수동으로 관리하므로 여기에 GeoJSON 컴포넌트 없음 */}
      </MapContainer>
      
      {/* 제목 표시 */}
      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
        시·도별 기후위험도
      </div>
    </div>
  );
} 