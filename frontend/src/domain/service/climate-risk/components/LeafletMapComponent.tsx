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

// Dynamic import for react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.GeoJSON })), { ssr: false });

interface LeafletMapComponentProps {
  onProvinceSelect?: (provinceName: string, bounds: any) => void;
}

export default function LeafletMapComponent({ onProvinceSelect }: LeafletMapComponentProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/maps/skorea-provinces-2018-geo.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGeoData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading geo data:', err);
        setError('지도 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, []);

  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const provinceName = feature.properties.prov_name || feature.properties.name;
    
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
        // 원래 스타일로 복원
        const targetLayer = e.target;
        targetLayer.setStyle({
          fillOpacity: 0.6,
          fillColor: '#cfe2ff'
        });
      },
      click: (e) => {
        const targetLayer = e.target;
        const bounds = targetLayer.getBounds();
        
        // 지도 중심을 클릭된 지역으로 이동
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
        
        // 부모 컴포넌트에 선택된 지역 정보 전달
        if (onProvinceSelect) {
          onProvinceSelect(provinceName, bounds);
        }
        
        console.log('Selected province:', provinceName);
      }
    });

    // Tooltip 바인딩
    if (layer instanceof L.Path) {
      layer.bindTooltip(provinceName, {
        permanent: false,
        direction: 'top',
        className: 'map-tooltip'
      });
    }
  };

  const geoJsonStyle = () => ({
    fillColor: '#cfe2ff',
    weight: 1,
    opacity: 1,
    color: '#1e4fa3',
    fillOpacity: 0.6
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">지도 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
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
        {geoData && (
          <GeoJSON
            key="korea-provinces"
            data={geoData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
} 