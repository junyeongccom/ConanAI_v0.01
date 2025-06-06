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

interface MunicipalityMapProps {
  provinceInfo: ProvinceInfo;
}

// Dynamic import for react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });

export default function MunicipalityMap({ provinceInfo }: MunicipalityMapProps) {
  const [municipalitiesData, setMunicipalitiesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  // 다중 속성명으로 시도 매칭
  const matchProvince = (feature: any, targetProvince: string): boolean => {
    const p = feature.properties;
    return (
      p.prov_name === targetProvince ||
      p.province === targetProvince ||
      p.sidonm === targetProvince ||
      p.name === targetProvince ||
      // 코드 기반 매칭도 추가
      (provinceInfo.code && p.code && p.code.startsWith(provinceInfo.code))
    );
  };

  // 시도명에 따른 시군구 필터링 코드 매핑 (백업용)
  const getProvinceCode = (provinceName: string): string => {
    const codeMap: { [key: string]: string } = {
      '서울특별시': '11',
      '부산광역시': '21',
      '대구광역시': '22',
      '인천광역시': '23',
      '광주광역시': '24',
      '대전광역시': '25',
      '울산광역시': '26',
      '세종특별자치시': '29',
      '경기도': '31',
      '강원도': '32',
      '강원특별자치도': '32',
      '충청북도': '33',
      '충청남도': '34',
      '전북특별자치도': '35',
      '전라북도': '35',
      '전라남도': '36',
      '경상북도': '37',
      '경상남도': '38',
      '제주특별자치도': '39',
      '제주도': '39',
    };
    return codeMap[provinceName] || '';
  };

  useEffect(() => {
    const loadMunicipalityData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/maps/skorea-municipalities-2018-geo.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMunicipalitiesData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading municipality data:', err);
        setError('시군구 지도 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMunicipalityData();
  }, []);

  // 시도 변경 시 레이어 업데이트
  useEffect(() => {
    if (!municipalitiesData || !provinceInfo.name || !mapRef.current) {
      setHasData(false);
      setFilteredCount(0);
      return;
    }

    const map = mapRef.current;

    console.log('=== MUNICIPALITY LAYER UPDATE ===');
    console.log('Province:', provinceInfo.name);
    console.log('Province code:', provinceInfo.code);

    // map이 준비된 후 레이어 업데이트 수행
    map.whenReady(() => {
      // 1) 기존 레이어 제거
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          console.log('✓ Previous layer removed');
        } catch (err) {
          console.warn('Failed to remove previous layer:', err);
        }
        layerRef.current = null;
      }

      // 2) 새 데이터 필터링 (다중 속성명 지원)
      const filtered = municipalitiesData.features.filter((feature: any) => {
        const isMatch = matchProvince(feature, provinceInfo.name);
        
        // 코드 기반 백업 필터링
        if (!isMatch && provinceInfo.code) {
          const code = feature.properties.code || '';
          return code.startsWith(provinceInfo.code);
        }
        
        // 추가 백업: 이름 기반 필터링
        if (!isMatch) {
          const targetCode = getProvinceCode(provinceInfo.name);
          if (targetCode) {
            const code = feature.properties.code || '';
            return code.startsWith(targetCode);
          }
        }
        
        return isMatch;
      });

      console.log('Filtered municipalities:', filtered.length);
      setFilteredCount(filtered.length);

      if (filtered.length === 0) {
        setHasData(false);
        console.log('No data found for province:', provinceInfo.name);
        return;
      }

      setHasData(true);

      // 3) 새 레이어 생성 및 추가
      try {
        const geoJsonData = {
          type: "FeatureCollection",
          features: filtered
        };

        const newLayer = L.geoJSON(geoJsonData, {
          style: () => ({
            fillColor: '#cfe2ff',
            weight: 1,
            opacity: 1,
            color: '#1e4fa3',
            fillOpacity: 0.6
          }),
          onEachFeature: (feature, layer) => {
            const municipalityName = feature.properties.name;
            
            layer.on({
              mouseover: (e) => {
                const targetLayer = e.target;
                targetLayer.setStyle({
                  fillOpacity: 0.7,
                  fillColor: '#93c5fd'
                });
                targetLayer.bringToFront();
              },
              mouseout: (e) => {
                if (newLayer) {
                  newLayer.resetStyle(e.target);
                }
              }
            });

            // Tooltip 바인딩
            layer.bindTooltip(municipalityName, {
              permanent: false,
              direction: 'top',
              className: 'map-tooltip'
            });
          }
        }).addTo(map);

        layerRef.current = newLayer;
        console.log('✓ New layer added with', filtered.length, 'features');

        // 4) bounds 적용
        if (provinceInfo.bounds && provinceInfo.bounds.isValid()) {
          map.fitBounds(provinceInfo.bounds, { padding: [20, 20] });
          console.log('✓ Bounds applied');
        } else {
          // bounds가 없으면 레이어의 bounds 사용
          try {
            const layerBounds = newLayer.getBounds();
            if (layerBounds && layerBounds.isValid()) {
              map.fitBounds(layerBounds, { padding: [20, 20] });
              console.log('✓ Layer bounds applied');
            }
          } catch (err) {
            console.warn('Failed to fit layer bounds:', err);
          }
        }

      } catch (err) {
        console.error('Failed to create new layer:', err);
        setHasData(false);
      }

      console.log('=== END MUNICIPALITY LAYER UPDATE ===');
    });
  }, [municipalitiesData, provinceInfo]);

  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
    console.log('Municipality map created');
  };

  // 시도가 선택되지 않은 경우
  if (!provinceInfo.name) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-gray-600 text-sm font-medium">시·도를 선택하세요</p>
          <p className="text-gray-500 text-xs mt-1">좌측 지도에서 지역을 클릭해주세요</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">시군구 지도 로딩 중...</p>
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

  if (!hasData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-gray-600 text-sm font-medium">{provinceInfo.name}</p>
          <p className="text-gray-500 text-xs mt-1">시군구 데이터가 없습니다</p>
          {filteredCount > 0 && (
            <p className="text-gray-400 text-xs mt-1">필터링된 데이터: {filteredCount}개</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={`municipality-map-${provinceInfo.name}`}
        ref={handleMapCreated}
        center={[36.5, 127.5]}
        zoom={7}
        minZoom={6}
        maxZoom={12}
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
      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
        {provinceInfo.name} 시·군·구
      </div>
      
      {/* 시군구 개수 표시 */}
      {hasData && filteredCount > 0 && (
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 z-10">
          {filteredCount}개 지역
        </div>
      )}
    </div>
  );
} 