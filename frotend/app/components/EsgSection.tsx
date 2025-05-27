"use client";
import React from 'react';

export default function EsgSection() {
  return (
    <>
      <section className="max-w-5xl mx-auto text-center space-y-10 pt-24">
        {/* 히어로 타이틀 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-snug bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ESG 전자공시 자동화 시스템
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
          "2025년부터 시작된 ESG 공시의무화 — 지속가능경영보고서를 PDF 보고서로 제출하는 시대는 끝났습니다.
          이제는 XBRL·DSD 기반의 구조화된 전자공시 체계로의 전환에 대비할 때입니다."
        </p>

        {/* 정책 설명 카드 */}
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-indigo-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
            금융위원회 ESG 공시 정책
          </h3>
          <div className="space-y-4">
            <p className="text-base text-gray-300 leading-relaxed">
              금융위원회는 2024~2025년 회의를 통해
            </p>
            <ul className="list-decimal list-inside text-base text-gray-300 leading-relaxed space-y-2">
              <li>ESRS 및 ISSB 기준을 반영한 KSSB ESG 공시 기준 수립 계획을 공식화했고,</li>
              <li>기후 관련 항목부터 의무공시 대상으로 우선 적용,</li>
              <li>EU Taxonomy 및 역외기업 공시 규정 대응을 고려한 공시체계 정비를 예고했습니다.</li>
            </ul>
          </div>
        </div>

        {/* 시스템 개요 */}
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-indigo-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
            ⚙️ 시스템 개요: ConanAI ESG 공시 자동화 시스템
          </h3>
          <div className="space-y-4">
            <ul className="list-disc list-inside text-base text-gray-300 leading-relaxed space-y-2">
              <li>AI 지원 기반 '반자동화 구조'</li>
              <li>수기 입력, 규제 기준 매핑, AI 보조 생성, 그리고 최종 검토까지</li>
              <li>공시 담당자의 책임은 지키되, 반복 작업은 줄입니다</li>
            </ul>
          </div>
        </div>

        {/* 프로세스 설명 */}
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-indigo-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
            🔄 ESG 공시 자동화 프로세스
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">① 필수 데이터 입력</h4>
              <ul className="list-disc list-inside text-base text-gray-300 leading-relaxed space-y-2">
                <li>ESRS/ISSB 기준에 따른 공시 체크리스트 제공</li>
                <li>EU Taxonomy 활동(NACE 코드) 및 환경목표 매핑 도우미</li>
                <li>모든 입력은 사용자가 직접 확인·기재</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">② 적합성 판단 (AI 보조 기능)</h4>
              <ul className="list-disc list-inside text-base text-gray-300 leading-relaxed space-y-2">
                <li>사용자가 입력한 텍스트와 ESRS/ISSB 요구사항 간 유사도 분석</li>
                <li>기술 심사 기준 + DNSH 조건 기반 자동 판별 (EU Taxonomy)</li>
                <li className="text-sm text-gray-400">※ 이 단계는 '자동 추천'이 아닌, 사용자의 의사결정 참고 도구로 제공됨</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">③ 보고서 생성</h4>
              <ul className="list-disc list-inside text-base text-gray-300 leading-relaxed space-y-2">
                <li>정성정보 → TCFD 프레임워크 구조에 맞춰 AI가 서술 초안을 제안, 사용자 검토 후 확정</li>
                <li>정량정보 → ESRS XBRL taxonomy 태그 자동 매핑 및 XML 구조 생성</li>
                <li className="text-sm text-gray-400">※ 모든 문서는 사용자가 수정, 보완, 최종 승인하는 프로세스를 전제로 합니다.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-red-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold text-red-400 mb-6">⛔ 주의사항</h3>
          <p className="text-base text-gray-300 leading-relaxed">
            본 시스템은 금융감독원이 고시한 DART 제출 포맷과는 다른,
            ESRS 기준의 내부 시뮬레이션용 XBRL 구조를 따릅니다.
            따라서 공식 공시용이 아닌 '사전 자동화 지원 시스템'으로 이해해 주세요.
          </p>
        </div>

        {/* 준비 이유 */}
        <div className="mt-20 mb-20 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-[#1c2444]/80 to-[#111827]/80 border border-indigo-500/20 p-10 text-left shadow-xl">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
            ✅ 왜 지금 준비해야 하는가?
          </h3>
          <div className="space-y-4">
            <p className="text-base text-gray-300 leading-relaxed">
              - ESG 공시 기준은 이미 국제적으로 정교한 기준을 요구하고 있으며, 
              이에 선제적으로 대응하는 기업일수록 투자자와의 신뢰 형성에 유리한 위치를 점할 수 있습니다.
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              - 완전한 자동화를 추구하기보다, 반복 업무를 줄이고 공시 기준을 구조화함으로써 
              업무 효율성과 보고 품질을 균형 있게 향상시킬 수 있습니다.
            </p>
            <p className="text-base text-gray-300 leading-relaxed font-semibold mt-4">
            ConanAI는 기술적 정밀성과 실무 관점을 결합한 하이브리드 자동화 시스템을 지향합니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA 버튼 - ESG공시 탭 전용 */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
          <button
            onClick={() => window.location.href = '/dashboard/esg'}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-xl font-semibold transform transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none mx-auto sm:mx-0"
          >
            시연 해보기
          </button>
          <a
            href="/pdf/esg-proposal.pdf"
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