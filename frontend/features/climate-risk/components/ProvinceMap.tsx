'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

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
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 위험도에 따른 색상 반환
  const getRiskColor = (changeAmount: number): string => {
    if (changeAmount >= 21) return '#dc2626'; // 매우 높음 (21일+) - 빨간색
    if (changeAmount >= 16) return '#a16207'; // 높음 (16-20일) - 갈색
    if (changeAmount >= 11) return '#ea580c'; // 보통 (11-15일) - 주황색
    return '#eab308'; // 낮음 (0-10일) - 노란색
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
                 // 시나리오를 API 형식으로 변환
         const getApiScenario = (scenario: string) => {
           const scenarioMap: { [key: string]: string } = {
             'SSP1-2.6': 'ssp1-2.6',
             'SSP2-4.5': 'ssp2-4.5', 
             'SSP3-7.0': 'ssp3-7.0',
             'SSP5-8.5': 'ssp5-8.5'
           };
           return scenarioMap[scenario] || 'ssp2-4.5';
         };

                 // 지도 데이터 로드
         const geoResponse = await fetch('/maps/skorea-provinces-2018-geo.json');
        if (!geoResponse.ok) {
          throw new Error('지도 데이터를 불러올 수 없습니다.');
        }
        const geoData = await geoResponse.json();
        setProvincesData(geoData);

                 // 위험도 데이터 로드 시도
         const apiScenario = getApiScenario(selectedScenario);
         console.log('=== 시나리오 변환 ===');
         console.log('선택된 시나리오:', selectedScenario);
         console.log('API 시나리오:', apiScenario);
         console.log('API 호출:', `http://localhost:8000/api/climate-risk/heatwave-days?scenario=${apiScenario}`);
        
        try {
          const riskResponse = await fetch(`http://localhost:8000/api/climate-risk/heatwave-days?scenario=${apiScenario}`);
          
          if (riskResponse.ok) {
            const apiData = await riskResponse.json();
            console.log('API 응답 성공:', apiData);
            
                         if (apiData.status === 'success' && apiData.data) {
               console.log('✅ 실제 API 데이터 사용:', apiData.data.length, '개 지역');
               setRiskData(apiData.data);
             } else {
               throw new Error('API 응답 형식이 올바르지 않습니다.');
             }
          } else {
            throw new Error(`API 호출 실패: ${riskResponse.status}`);
          }
        } catch (apiError) {
          console.warn('API 호출 실패, 목 데이터 사용:', apiError);
          
          // API 실패 시 목 데이터 사용
          const getMockRiskData = (scenario: string) => {
            const baseData = [
              { region: '경기도', avg_change_amount: 15.7 },
              { region: '경상남도', avg_change_amount: 13.3 },
              { region: '경상북도', avg_change_amount: 12.6 },
              { region: '전라남도', avg_change_amount: 12.6 },
              { region: '충청남도', avg_change_amount: 15.6 },
              { region: '충청북도', avg_change_amount: 17.1 },
              { region: '광주광역시', avg_change_amount: 17.2 },
              { region: '대구광역시', avg_change_amount: 17.5 },
              { region: '대전광역시', avg_change_amount: 19.7 },
              { region: '부산광역시', avg_change_amount: 10.6 },
              { region: '서울특별시', avg_change_amount: 17.5 },
              { region: '울산광역시', avg_change_amount: 9.9 },
              { region: '인천광역시', avg_change_amount: 11.0 },
              { region: '강원특별자치도', avg_change_amount: 8.5 },
              { region: '세종특별자치시', avg_change_amount: 17.2 },
              { region: '전북특별자치도', avg_change_amount: 15.9 },
              { region: '제주특별자치도', avg_change_amount: 7.8 }
            ];

                         // 시나리오별 변화량 조정 (명확한 차이)
             const multiplier = scenario === 'SSP1-2.6' ? 0.6 : 
                              scenario === 'SSP2-4.5' ? 1.0 : 
                              scenario === 'SSP3-7.0' ? 1.4 : 1.8; // SSP5-8.5

            return baseData.map(item => ({
              ...item,
              avg_change_amount: Math.round(item.avg_change_amount * multiplier * 10) / 10
            }));
          };

                     const mockData = getMockRiskData(selectedScenario);
           console.log('⚠️ 목 데이터 사용:', selectedScenario, '시나리오');
           console.log('목 데이터 샘플:', mockData.slice(0, 2));
           setRiskData(mockData);
        }

      } catch (err) {
        console.error('데이터 로드 에러:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedScenario]);

  const geoJsonStyle = (feature: any) => {
    if (!feature || !riskData) {
      console.log('No feature or riskData:', { feature: !!feature, riskData: !!riskData });
      return { fillColor: '#gray', weight: 1, opacity: 1, color: '#666', fillOpacity: 0.5 };
    }
    
    // 다양한 속성명으로 지역명 찾기
    const provinceName = feature.properties.prov_name || 
                        feature.properties.name || 
                        feature.properties.CTP_KOR_NM || 
                        feature.properties.CTPRVN_CD ||
                        feature.properties.sido ||
                        'Unknown';
    
    // riskData가 배열인지 확인
    const riskArray = Array.isArray(riskData) ? riskData : (riskData.data || []);
    
    // 지역명으로 데이터 찾기 (백엔드 응답의 region 필드 사용)
    let riskInfo = riskArray.find((item: any) => item.region === provinceName);
    
    // 매칭 실패 시 부분 매칭 시도
    if (!riskInfo) {
      riskInfo = riskArray.find((item: any) => {
        const itemRegion = item.region || '';
        return itemRegion.includes(provinceName) || provinceName.includes(itemRegion);
      });
    }
    
    // 특별한 경우 매핑
    if (!riskInfo) {
      const regionMapping: { [key: string]: string } = {
        '강원도': '강원특별자치도',
        '강원특별자치도': '강원도',
        '전라북도': '전북특별자치도',
        '전북특별자치도': '전라북도'
      };
      
      const mappedName = regionMapping[provinceName];
      if (mappedName) {
        riskInfo = riskArray.find((item: any) => item.region === mappedName);
      }
    }
    
    const changeAmount = riskInfo ? riskInfo.avg_change_amount : 0;
    const color = getRiskColor(changeAmount);
    
    console.log(`Province: ${provinceName}, Found: ${!!riskInfo}, Change: ${changeAmount}, Color: ${color}`);
    
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
    const provinceName = feature.properties.prov_name || 
                        feature.properties.name || 
                        feature.properties.CTP_KOR_NM || 
                        feature.properties.CTPRVN_CD ||
                        feature.properties.sido ||
                        'Unknown';
    
    // riskData가 배열인지 확인
    const riskArray = Array.isArray(riskData) ? riskData : (riskData.data || []);
    
    // 지역명으로 데이터 찾기 (백엔드 응답의 region 필드 사용)
    let riskInfo = riskArray.find((item: any) => item.region === provinceName);
    
    // 매칭 실패 시 부분 매칭 시도
    if (!riskInfo) {
      riskInfo = riskArray.find((item: any) => {
        const itemRegion = item.region || '';
        return itemRegion.includes(provinceName) || provinceName.includes(itemRegion);
      });
    }
    
    // 특별한 경우 매핑
    if (!riskInfo) {
      const regionMapping: { [key: string]: string } = {
        '강원도': '강원특별자치도',
        '강원특별자치도': '강원도',
        '전라북도': '전북특별자치도',
        '전북특별자치도': '전라북도'
      };
      
      const mappedName = regionMapping[provinceName];
      if (mappedName) {
        riskInfo = riskArray.find((item: any) => item.region === mappedName);
      }
    }
    
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

  console.log('=== RENDER CHECK ===');
  console.log('provincesData exists:', !!provincesData);
  console.log('riskData exists:', !!riskData);
  console.log('riskData length:', riskData?.length || 0);

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