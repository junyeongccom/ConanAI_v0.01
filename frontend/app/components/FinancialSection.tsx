"use client";
import React from 'react';

export default function FinancialSection() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="max-w-5xl mx-auto text-center space-y-10 pt-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-snug bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AI가 보고서 생성부터 검증까지<br />XBRL / DSD 공시 자동화
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
          더 이상 일일이 입력하지 마세요. 당신은 더 가치 있는 인력입니다
        </p>
        <div className="w-full mx-auto mb-12 relative overflow-visible aspect-video">
          <video 
            src="/videos/demo.mp4"
            className="w-full h-auto object-cover rounded-xl shadow-lg z-10"
            autoPlay
            loop
            muted
            playsInline
            controls
            controlsList="nodownload"
            preload="metadata"
            style={{ position: 'relative', zIndex: 10 }}
          />
        </div>
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-indigo-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">AI로 실무자의 고통을 덜다</h3>
          <div className="space-y-4">
            <p className="text-base text-gray-300 leading-relaxed">
              XBRL/DSD 공시를 담당하는 실무자들은 이중 입력, 텍사노미 매핑 오류, 수작업 기반 작성 등 
              복잡하고 반복적인 업무로 지속적인 어려움을 겪고 있습니다.
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              저희는 이러한 구조적 문제를 AI 기반 자동화 기술로 해결하여, 
              공시 실무의 효율성과 정확성을 모두 확보합니다.
            </p>
          </div>
        </div>
      </section>
      {/* 실무자 인터뷰 블록 */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h3 className="text-3xl text-center font-bold text-white mb-12">실무자들은 지금도 불편함을 호소하고 있습니다</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1e293b] p-8 rounded-xl shadow-lg border border-indigo-500/20 relative">
            <div className="absolute top-4 left-4 text-5xl text-indigo-500/30 font-serif">❝</div>
            <div className="pl-8 pt-6 relative z-10">
              <p className="text-sm font-light text-gray-200 leading-relaxed mb-4">
                DSD 보고서는 복붙이 원활히 되지 않아 시간이 오래 걸리고, 단위(백만) 조정도 자주 해야 해요. 그걸 AI가 자동 조정해주면 정말 좋겠어요.
              </p>
              <p className="text-sm font-light text-gray-200 leading-relaxed mb-6">
                XBRL, DSD 모두 공동작업이 안 돼서 메일로 파일 주고받는 것도 너무 불편합니다.
              </p>
              <p className="text-sm font-semibold text-gray-300">– S** 계열사 재무팀</p>
            </div>
          </div>
          <div className="bg-[#1e293b] p-8 rounded-xl shadow-lg border border-indigo-500/20 relative">
            <div className="absolute top-4 left-4 text-5xl text-indigo-500/30 font-serif">❝</div>
            <div className="pl-8 pt-6 relative z-10">
              <p className="text-sm font-light text-gray-200 leading-relaxed mb-4">
                XBRL에서 적절한 택사노미 요소를 찾는 것도 어렵고, DSD → XBRL로 작성하면 형식이 달라서 오류가 자주 발생해요.
              </p>
              <p className="text-sm font-light text-gray-200 leading-relaxed mb-6">
                작성자 입장에선 시간과 인력 소모가 너무 큽니다.
              </p>
              <p className="text-sm font-semibold text-gray-300">– L** 계열사 재무팀</p>
            </div>
          </div>
        </div>
      </section>
      {/* 실무자 고충 vs 자동화 솔루션 */}
      <section className="max-w-6xl mx-auto mb-20 px-4">
        <div className="relative w-full text-center mb-12 mt-20">
          <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 opacity-20 z-0 blur-sm max-w-3xl mx-auto">
            현재도 수많은 DART 공시 담당자들이 반복되는 작성 환경에 불편함을 호소하고 있습니다.
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold relative z-10 flex flex-col md:flex-row justify-center items-center gap-4">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">실무자 고충</span>
            <span className="text-gray-500 text-xl md:text-2xl opacity-80">vs</span>
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">자동화 솔루션</span>
          </h2>
        </div>
        <div className="space-y-10">
          {/* 행 1: 이중입력 문제 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-10 items-center justify-items-center max-w-6xl mx-auto">
            {/* 왼쪽 - 문제 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-red-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">DSD/XBRL 이중입력</p>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  동일 재무정보를 DSD와 XBRL에 각각 입력하며 발생하는 시간 낭비와 데이터 불일치로 인한 검증 문제
                </p>
              </div>
            </div>
            {/* 가운데 - 화살표 */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-gray-300 text-3xl opacity-90">➜</span>
            </div>
            {/* 오른쪽 - 솔루션 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-blue-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">엑셀 업로드 → XBRL & DSD 자동 생성</p>
                <div className="space-y-3">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    엑셀 재무제표 파일 업로드 한 번으로 XBRL 및 DSD 문서 동시 처리
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    데이터 일관성 자동 검증 및 오류 알림으로 이중 입력 부담 해소
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 행 2: 텍소노미 매핑 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-10 items-center justify-items-center max-w-6xl mx-auto">
            {/* 왼쪽 - 문제 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-red-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">텍소노미 매핑 오류</p>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  적절한 텍소노미 요소 선정 어려움과 속성 불일치로 인한 오류 발생 및 검증 실패
                </p>
              </div>
            </div>
            {/* 가운데 - 화살표 */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-gray-300 text-3xl opacity-90">➜</span>
            </div>
            {/* 오른쪽 - 솔루션 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-blue-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">AI 기반 텍소노미 추천 시스템</p>
                <div className="space-y-3">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    기간 속성 자동 필터링 및 최적화로 오류 발생 최소화
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    유사 계정과목 자동 매핑 및 비교 분석으로 텍소노미 선택 정확도 향상
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 행 3: UI 비직관성 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-10 items-center justify-items-center max-w-6xl mx-auto">
            {/* 왼쪽 - 문제 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-red-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">편집기 UI 비직관성</p>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  낯선 인터페이스와 비협업적 환경으로 인한 반복 수정 및 효율성 저하
                </p>
              </div>
            </div>
            {/* 가운데 - 화살표 */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-gray-300 text-3xl opacity-90">➜</span>
            </div>
            {/* 오른쪽 - 솔루션 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-blue-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">협업형 인터페이스와 버전 관리</p>
                <div className="space-y-3">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    엑셀과 유사한 직관적 웹 기반 인터페이스로 학습 곡선 최소화
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    실시간 협업 및 코멘트 기능 내장, 버전 관리 및 변경 이력 추적 시스템
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 행 4: 반복 검증 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-10 items-center justify-items-center max-w-6xl mx-auto">
            {/* 왼쪽 - 문제 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-red-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">반복 검증 작업</p>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  계정 간 수치 대조, 전기 대비 변동 확인 등 수작업 검증으로 인한 리소스 낭비
                </p>
              </div>
            </div>
            {/* 가운데 - 화살표 */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-gray-300 text-3xl opacity-90">➜</span>
            </div>
            {/* 오른쪽 - 솔루션 카드 */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-[#1c2444] to-[#111827] p-6 md:p-8 rounded-xl shadow border border-blue-500/20 transform transition-transform hover:translate-y-[-4px] h-full flex flex-col">
                <p className="font-semibold text-lg md:text-xl mb-4 text-white break-words">자동 검증 및 분석 리포트</p>
                <div className="space-y-3">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    회계 원칙 기반 자동 검증(자산=부채+자본 등) 및 전기 대비 증감 자동 분석
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    오류 메시지 자동 해석 및 수정 가이드 제공으로 검증 시간 단축
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 버튼 - 재무공시 탭 전용 */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-xl font-semibold transform transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none mx-auto sm:mx-0"
          >
            시연 해보기
          </button>
          <a
            href="/pdf/financial-proposal.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-xl text-lg font-semibold transform transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 focus:outline-none border border-indigo-500/30 mx-auto sm:mx-0 cursor-pointer"
          >
            상세 기획안 보기
          </a>
        </div>
      </section>
    </>
  );
} 