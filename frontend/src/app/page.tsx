// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaRegClock, 
  FaRegLightbulb, 
  FaRegChartBar, 
  FaRobot, 
  FaKeyboard, 
  FaChartLine, 
  FaTasks,
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaChartPie,
  FaUsers
} from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* 1. 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            ESG 의무공시 시대
            <br />
            ISSB, 지금부터 준비해야 합니다.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            AI 기반 자동화로 정확하고 효율적인 IFRS S2 보고서를 지금 바로 생성하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              보고서 생성 시작
              <FaArrowRight className="text-sm" />
            </Link>
            <button
              onClick={() => handleScrollToSection('problem-solution')}
              className="text-white border border-white/50 hover:bg-white/10 py-3 px-8 rounded-full transition-all duration-300"
            >
              Sky-C 자세히 알아보기
            </button>
          </div>
        </div>
      </section>
      {/* 3. 긴급성 및 혜택 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            미래를 위한 선택: 지금부터 IFRS S2에 대비해야 하는 이유
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
              <FaUsers className="text-blue-500 text-3xl mb-3" />
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                투자자의 최우선 요구
              </h3>
              <p className="text-gray-600 text-sm">
                ESG 투자가 주류가 되면서 투자자들이 기후 관련 재무 정보 공시를 필수적으로 요구하고 있습니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
              <FaChartPie className="text-green-500 text-3xl mb-3" />
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                재무적 가치에 직접적인 영향
              </h3>
              <p className="text-gray-600 text-sm">
                기후 리스크와 기회를 제대로 관리하지 못하면 기업 가치 평가에 부정적 영향을 미칠 수 있습니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-500">
              <FaShieldAlt className="text-purple-500 text-3xl mb-3" />
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                규제 의무화의 확산
              </h3>
              <p className="text-gray-600 text-sm">
                전 세계적으로 ISSB 도입이 가속화되고 있으며, 조기 준비가 경쟁 우위를 가져다줍니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 border-l-4 border-orange-500">
              <FaGlobe className="text-orange-500 text-3xl mb-3" />
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                시장 경쟁력 확보
              </h3>
              <p className="text-gray-600 text-sm">
                투명한 기후공시는 이해관계자 신뢰를 높이고 글로벌 시장에서의 경쟁력을 강화합니다.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/disclosure-info/adoption-status"
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
              >
                ISSB 도입 현황 자세히 보기
                <FaArrowRight className="text-sm" />
              </Link>
              <Link 
                href="/disclosure-info/concepts"
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                기후공시 개념 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 핵심 기능 개요 섹션 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Sky-C가 제공하는 핵심 기능
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaRobot className="text-blue-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                AI 자동화 보고서
              </h3>
              <p className="text-gray-600">
                복잡한 IFRS S2 요구사항을 AI가 자동으로 분석하고 보고서를 생성합니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaKeyboard className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                간편한 데이터 입력
              </h3>
              <p className="text-gray-600">
                직관적인 인터페이스로 누구나 쉽게 기후 관련 데이터를 입력할 수 있습니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaChartLine className="text-purple-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                실시간 분석 대시보드
              </h3>
              <p className="text-gray-600">
                기후 리스크와 기회를 실시간으로 모니터링하고 분석할 수 있습니다.
              </p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaTasks className="text-orange-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                진행 상황 관리
              </h3>
              <p className="text-gray-600">
                공시 준비 과정을 체계적으로 관리하고 마감일을 놓치지 않도록 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 최종 CTA 섹션 */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 Sky-C와 함께
            <br />
            기후공시의 미래를 경험하세요.
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            더 이상 복잡한 준비 과정으로 고민하지 마세요. 
            Sky-C의 AI 기반 솔루션으로 IFRS S2 대응을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 py-4 px-8 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-lg"
            >
              지금 시작하기
              <FaArrowRight />
            </Link>
            <Link 
              href="/dashboard"
              className="text-white border-2 border-white hover:bg-white hover:text-blue-600 py-4 px-8 rounded-full font-medium transition-all duration-300"
            >
              대시보드 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
