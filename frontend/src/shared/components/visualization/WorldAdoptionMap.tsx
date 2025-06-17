'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Leaflet 관련 import들을 동적으로 처리
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Leaflet 기본 아이콘 설정 함수
const setupLeafletIcons = async () => {
  if (typeof window !== 'undefined') {
    const L = (await import('leaflet')).default;
    
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

interface AdoptionStatus {
  id: number;
  country: string;
  region: string;
  adoption_status: string;
  effective_date: string | null;
  notes: string | null;
}

interface WorldAdoptionMapProps {
  adoptionData: AdoptionStatus[];
}

const WorldAdoptionMap: React.FC<WorldAdoptionMapProps> = ({ adoptionData }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setupLeafletIcons();
    
    // 세계 지도 GeoJSON 데이터 로드
    const loadGeoData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('지도 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // 국가명 매핑 함수 (GeoJSON의 국가명과 API 데이터의 국가명 매칭)
  const findAdoptionStatus = (countryName: string): AdoptionStatus | null => {
    // 국가명 매핑 테이블 (GeoJSON 국가명 -> API 데이터 국가명)
    const countryMapping: { [key: string]: string } = {
      'United States of America': 'United States',
      'United Kingdom': 'UK',
      'South Korea': 'Korea',
      'Republic of Korea': 'Korea',
      'China': 'China',
      'Japan': 'Japan',
      'Germany': 'Germany',
      'France': 'France',
      'Canada': 'Canada',
      'Australia': 'Australia',
      'India': 'India',
      'Brazil': 'Brazil',
      'South Africa': 'South Africa',
      'Mexico': 'Mexico',
      'Italy': 'Italy',
      'Spain': 'Spain',
      'Netherlands': 'Netherlands',
      'Switzerland': 'Switzerland',
      'Sweden': 'Sweden',
      'Norway': 'Norway',
      'Singapore': 'Singapore',
      'New Zealand': 'New Zealand',
      // 필요에 따라 더 추가할 수 있습니다
    };

    // countryName이 없으면 null 반환
    if (!countryName) return null;

    const mappedName = countryMapping[countryName] || countryName;
    
    return adoptionData.find(item => {
      if (!item.country) return false;
      
      const itemCountryLower = item.country.toLowerCase();
      const mappedNameLower = mappedName.toLowerCase();
      const countryNameLower = countryName.toLowerCase();
      
      return itemCountryLower === mappedNameLower ||
             itemCountryLower === countryNameLower ||
             mappedNameLower.includes(itemCountryLower) ||
             itemCountryLower.includes(mappedNameLower);
    }) || null;
  };

  // 도입 상태에 따른 색상 결정
  const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return '#6b7280'; // 회색 (정보 없음)
    switch (status.toLowerCase()) {
      case 'adopted':
        return '#10b981'; // 녹색 (도입 완료)
      case 'planned':
        return '#f59e0b'; // 주황색 (도입 예정)
      case 'under_consideration':
        return '#3b82f6'; // 파란색 (검토 중)
      default:
        return '#6b7280'; // 회색 (정보 없음)
    }
  };

  // 도입 상태 한글 변환
  const getStatusText = (status: string | null | undefined): string => {
    if (!status) return '정보 없음';
    switch (status.toLowerCase()) {
      case 'adopted':
        return '도입 완료';
      case 'planned':
        return '도입 예정';
      case 'under_consideration':
        return '검토 중';
      default:
        return '정보 없음';
    }
  };

  // GeoJSON 스타일 함수
  const geoJsonStyle = (feature: any) => {
    const countryName = feature?.properties?.NAME;
    const adoptionStatus = findAdoptionStatus(countryName);
    
    return {
      fillColor: adoptionStatus ? getStatusColor(adoptionStatus.adoption_status) : '#e5e7eb',
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.7,
    };
  };

  // 국가 클릭/호버 이벤트
  const onEachFeature = (feature: any, layer: any) => {
    const countryName = feature?.properties?.NAME;
    const adoptionStatus = findAdoptionStatus(countryName);
    
    if (adoptionStatus) {
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${adoptionStatus.country}</h3>
          <p style="margin: 4px 0;"><strong>지역:</strong> ${adoptionStatus.region}</p>
          <p style="margin: 4px 0;"><strong>도입 상태:</strong> 
            <span style="color: ${getStatusColor(adoptionStatus.adoption_status)}; font-weight: bold;">
              ${getStatusText(adoptionStatus.adoption_status)}
            </span>
          </p>
          ${adoptionStatus.effective_date ? `<p style="margin: 4px 0;"><strong>시행일:</strong> ${adoptionStatus.effective_date}</p>` : ''}
          ${adoptionStatus.notes ? `<p style="margin: 4px 0;"><strong>비고:</strong> ${adoptionStatus.notes}</p>` : ''}
        </div>
      `;
      
      layer.bindPopup(popupContent);
    } else {
      layer.bindPopup(`
        <div>
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${countryName}</h3>
          <p style="color: #6b7280;">ISSB 도입 현황 정보가 없습니다.</p>
        </div>
      `);
    }

    // 호버 효과
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#2563eb',
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle(feature));
      }
    });
  };

  if (!isClient || loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">지도 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-600">지도 데이터를 로드할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 지도 범례 */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">범례</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-sm text-gray-700">도입 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-sm text-gray-700">도입 예정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-sm text-gray-700">검토 중</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#e5e7eb' }}></div>
            <span className="text-sm text-gray-700">정보 없음</span>
          </div>
        </div>
      </div>

      {/* 지도 컨테이너 */}
      <div className="w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={geoData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>
      
      {/* 도움말 텍스트 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>사용법:</strong> 지도의 국가를 클릭하면 해당 국가의 ISSB 도입 현황을 자세히 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default WorldAdoptionMap; 