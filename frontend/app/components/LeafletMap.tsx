'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Leaflet CSS import
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  onRegionClick?: (regionName: string) => void;
  className?: string;
}

// Dynamic import for Leaflet to avoid SSR issues
const LeafletMapComponent = dynamic(() => import('./LeafletMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-600">지도를 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function LeafletMap({ onRegionClick, className = "w-full h-96" }: LeafletMapProps) {
  return (
    <div className={className}>
      <LeafletMapComponent onRegionClick={onRegionClick} />
    </div>
  );
} 