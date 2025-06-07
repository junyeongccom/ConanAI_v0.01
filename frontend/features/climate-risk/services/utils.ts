// 지도 지역명을 DB 지역명으로 매핑하는 함수
export const mapRegionNameForDB = (geoJsonRegionName: string): string => {
  const regionMapping: { [key: string]: string } = {
    '강원도': '강원특별자치도',
    '전라북도': '전북특별자치도',
    '제주도': '제주특별자치도'
  };
  
  return regionMapping[geoJsonRegionName] || geoJsonRegionName;
};

// 위험도 레벨 계산 함수
export const getRiskLevel = (changeRate: number) => {
  if (changeRate >= 100) return { level: '매우 높음', color: 'text-red-600 bg-red-100' };
  if (changeRate >= 50) return { level: '높음', color: 'text-orange-600 bg-orange-100' };
  if (changeRate >= 20) return { level: '보통', color: 'text-yellow-600 bg-yellow-100' };
  return { level: '낮음', color: 'text-green-600 bg-green-100' };
}; 