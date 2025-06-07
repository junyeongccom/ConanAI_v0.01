'use client';

import dynamic from 'next/dynamic';

// Leaflet을 동적으로 import하여 SSR 문제 해결
const LeafletMapComponent = dynamic(
  () => import('./LeafletMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }
);

interface LeafletMapProps {
  onProvinceSelect?: (provinceName: string, bounds: any) => void;
}

export default function LeafletMap({ onProvinceSelect }: LeafletMapProps) {
  return (
    <div className="w-full h-full">
      <LeafletMapComponent onProvinceSelect={onProvinceSelect} />
    </div>
  );
} 