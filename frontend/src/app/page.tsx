// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* 메인 섹션 */}
      <div className="text-center max-w-5xl mb-16">
        {/* 헤드라인 (20% 증가) */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          <span className="text-blue-600">기후리스크</span>의 <span className="text-blue-600">재무영향</span>을 미리 준비하세요.
        </h1>
        
        {/* 부제목 (10% 증가) */}
        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12 leading-relaxed">
          <span className="text-blue-600">TCFD</span> 프레임워크 기반 지역별 <span className="text-blue-600">기후리스크</span> 분석과 <span className="text-blue-600">재무영향</span> 평가를 쉽고 정확하게 제공합니다.
        </p>
        
        {/* 버튼 (더 넓고 패딩 추가) */}
        <a
          href="/climate-risk"
          className="inline-block px-12 py-5 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
        >
          기후리스크 평가 시작하기
        </a>
      </div>

      {/* 핵심 장점 영역 */}
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* 지역별 상세 분석 */}
          <div className="text-center p-6">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">지역별 상세 분석</h3>
            <p className="text-gray-600 leading-relaxed">
              폭염, 수자원 부족, 태풍 등 다양한 기후위험을 정확히 평가합니다.
            </p>
          </div>

          {/* 재무영향 시나리오 */}
          <div className="text-center p-6">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">재무영향 시나리오</h3>
            <p className="text-gray-600 leading-relaxed">
              기업 맞춤형으로 잠재적 재무영향과 리스크 시나리오를 제공합니다.
            </p>
          </div>

          {/* TCFD 리포트 자동화 */}
          <div className="text-center p-6">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">TCFD 리포트 자동화</h3>
            <p className="text-gray-600 leading-relaxed">
              TCFD 규제 준수 보고서를 클릭 몇 번으로 간편히 생성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
