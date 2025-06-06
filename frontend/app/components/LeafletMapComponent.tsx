'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapComponentProps {
  onRegionClick?: (regionName: string) => void;
}

interface GeoJsonFeature {
  type: string;
  properties: {
    name: string;
    name_eng: string;
    [key: string]: any;
  };
  geometry: any;
}

export default function LeafletMapComponent({ onRegionClick }: LeafletMapComponentProps) {
  const [provincesData, setProvincesData] = useState<any>(null);
  const [municipalitiesData, setMunicipalitiesData] = useState<any>(null);
  const [showMunicipalities, setShowMunicipalities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const municipalLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        
        // 광역시도 데이터 로드
        const provincesResponse = await fetch('/maps/skorea-provinces-2018-geo.json');
        if (!provincesResponse.ok) {
          throw new Error(`HTTP error! status: ${provincesResponse.status}`);
        }
        const provincesData = await provincesResponse.json();
        setProvincesData(provincesData);

        // 시군구 데이터 로드
        const municipalitiesResponse = await fetch('/maps/skorea-municipalities-2018-geo.json');
        if (!municipalitiesResponse.ok) {
          throw new Error(`HTTP error! status: ${municipalitiesResponse.status}`);
        }
        const municipalitiesData = await municipalitiesResponse.json();
        setMunicipalitiesData(municipalitiesData);

        setError(null);
      } catch (err) {
        console.error('Error loading GeoJSON data:', err);
        setError('지도 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // 줌 레벨에 따른 시군구 레이어 표시/숨김
  const handleZoomEnd = () => {
    if (mapRef.current) {
      const zoom = mapRef.current.getZoom();
      setShowMunicipalities(zoom >= 9);
    }
  };

  // 지도 초기화 시 이벤트 바인딩
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('zoomend', handleZoomEnd);
      return () => {
        if (mapRef.current) {
          mapRef.current.off('zoomend', handleZoomEnd);
        }
      };
    }
  }, [mapRef.current]);

  // 시도 레이어 이벤트 핸들러
  const onEachProvinceFeature = (feature: GeoJsonFeature, layer: L.Layer) => {
    const regionName = feature.properties.name;
    
    layer.on({
      click: (e) => {
        e.originalEvent?.stopPropagation();
        
        // 시도 클릭 시 해당 지역으로 확대
        if (mapRef.current) {
          const bounds = (layer as any).getBounds();
          mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }

        // onRegionClick 콜백 실행
        if (onRegionClick) {
          onRegionClick(regionName);
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#1e40af',
          fillOpacity: 0.8,
          fillColor: '#3b82f6'
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        provinceLayerRef.current?.resetStyle(e.target);
      }
    });

    // Tooltip 바인딩
    layer.bindTooltip(regionName, {
      permanent: false,
      direction: 'center',
      className: 'map-tooltip'
    });
  };

  // 시군구 레이어 이벤트 핸들러
  const onEachMunicipalityFeature = (feature: GeoJsonFeature, layer: L.Layer) => {
    const regionName = feature.properties.name;
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        municipalLayerRef.current?.resetStyle(e.target);
      }
    });

    // Tooltip 바인딩
    layer.bindTooltip(regionName, {
      permanent: false,
      direction: 'center',
      className: 'map-tooltip'
    });
  };

  const provinceLayerRef = useRef<L.GeoJSON | null>(null);

  // 시도 레이어 스타일
  const provinceStyle = () => {
    return {
      fillColor: '#60a5fa',
      weight: 2,
      opacity: 1,
      color: '#1e40af',
      fillOpacity: 0.6
    };
  };

  // 시군구 레이어 스타일
  const municipalityStyle = () => {
    return {
      fillColor: '#9ec6ff',
      weight: 1,
      opacity: 1,
      color: '#1e4fa3',
      fillOpacity: 0.5
    };
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">지도 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff] rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      ref={mapRef}
      center={[36.5, 127.5]}
      zoom={7}
      minZoom={6}
      maxZoom={12}
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
      {/* 시도 레이어 - 항상 표시 */}
      {provincesData && (
        <GeoJSON
          key="provinces"
          data={provincesData}
          style={provinceStyle}
          onEachFeature={onEachProvinceFeature}
          ref={provinceLayerRef}
        />
      )}

      {/* 시군구 레이어 - 줌 레벨 9 이상에서만 표시 */}
      {showMunicipalities && municipalitiesData && (
        <GeoJSON
          key="municipalities"
          data={municipalitiesData}
          style={municipalityStyle}
          onEachFeature={onEachMunicipalityFeature}
          ref={municipalLayerRef}
        />
      )}
    </MapContainer>
  );
} 