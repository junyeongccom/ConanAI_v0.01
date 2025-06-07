'use client';

import { useEffect, useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Leaflet CSS import
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProvinceInfo {
  name: string;
  bounds: L.LatLngBounds | null;
  code?: string;
}

interface MunicipalityMapProps {
  provinceInfo: ProvinceInfo;
}

export default function MunicipalityMap({ provinceInfo }: MunicipalityMapProps) {
  const [municipalitiesData, setMunicipalitiesData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 시도 변경 시 데이터 필터링
  useEffect(() => {
    if (!municipalitiesData || !provinceInfo.name) {
      setFilteredData(null);
      return;
    }

    // 새 데이터 필터링 (다중 속성명 지원)
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

    if (filtered.length > 0) {
      setFilteredData({
        type: "FeatureCollection",
        features: filtered
      });
    } else {
      setFilteredData(null);
    }
  }, [municipalitiesData, provinceInfo]);

  const geoJsonStyle = () => ({
    fillColor: '#cfe2ff',
    weight: 1,
    opacity: 1,
    color: '#1e4fa3',
    fillOpacity: 0.6
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
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
        e.target.setStyle(geoJsonStyle());
      }
    });

    // Tooltip 바인딩
    layer.bindTooltip(
      `<div style="font-family: 'Pretendard', sans-serif;">
        <strong>${municipalityName}</strong>
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

  if (!provinceInfo.name) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="text-blue-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">
            시·도를 선택하세요
          </p>
          <p className="text-gray-500 text-xs mt-1">
            좌측 지도에서 지역을 클릭하면 해당 시·군·구가 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  if (!filteredData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {provinceInfo.name}의 시·군·구 데이터가 없습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={provinceInfo.name}
        center={[36.5, 127.5]}
        zoom={8}
        className="w-full h-full rounded-lg"
        style={{ 
          backgroundColor: '#f0f4ff',
          minHeight: '100%'
        }}
        zoomControl={true}
        attributionControl={false}
      >
        <GeoJSON
          data={filteredData}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      
      {/* 제목 표시 */}
      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
        {provinceInfo.name} 시·군·구
      </div>
    </div>
  );
} 