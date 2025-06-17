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
      <section className="relative min-h-screen bg-gradient-to-r from-blue-600 to-green-500 text-white flex items-center overflow-hidden">
        {/* 배경 패턴과 애니메이션 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* 플로팅 요소들 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute bottom-20 right-10 w-14 h-14 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        </div>
        
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* 히어로 콘텐츠 */}
        <div className="relative z-10 w-full py-20 px-4 pt-32">
          <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            ESG 의무공시 시대
            <br />
            ISSB, 지금부터 준비해야 합니다.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
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
        </div>
      </section>
      {/* 3. 긴급성 및 혜택 섹션 */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            미래를 위한 선택: 지금부터 IFRS S2에 대비해야 하는 이유
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="p-10 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl hover:bg-white transition-all duration-300 border-l-4 border-blue-500">
              <FaUsers className="text-blue-500 text-5xl mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                투자자의 최우선 요구
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                ESG 투자가 주류가 되면서 투자자들이 기후 관련 재무 정보 공시를 필수적으로 요구하고 있습니다.
              </p>
            </div>
            
            <div className="p-10 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl hover:bg-white transition-all duration-300 border-l-4 border-green-500">
              <FaChartPie className="text-green-500 text-5xl mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                재무적 가치에 직접적인 영향
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                기후 리스크와 기회를 제대로 관리하지 못하면 기업 가치 평가에 부정적 영향을 미칠 수 있습니다.
              </p>
            </div>
            
            <div className="p-10 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl hover:bg-white transition-all duration-300 border-l-4 border-purple-500">
              <FaShieldAlt className="text-purple-500 text-5xl mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                규제 의무화의 확산
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                전 세계적으로 ISSB 도입이 가속화되고 있으며, 조기 준비가 경쟁 우위를 가져다줍니다.
              </p>
            </div>
            
            <div className="p-10 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl hover:bg-white transition-all duration-300 border-l-4 border-orange-500">
              <FaGlobe className="text-orange-500 text-5xl mb-6" />
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                시장 경쟁력 확보
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
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
      <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* 제목과 카드들 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">
              Sky-C가 제공하는 핵심 기능
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="p-8 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaRobot className="text-blue-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                AI 자동화 보고서
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                복잡한 IFRS S2 요구사항을 AI가 자동으로 분석하고 보고서를 생성합니다.
              </p>
            </div>
            
            <div className="p-8 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaKeyboard className="text-green-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                간편한 데이터 입력
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                직관적인 인터페이스로 누구나 쉽게 기후 관련 데이터를 입력할 수 있습니다.
              </p>
            </div>
            
            <div className="p-8 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaChartLine className="text-purple-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                실시간 분석 대시보드
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                기후 리스크와 기회를 실시간으로 모니터링하고 분석할 수 있습니다.
              </p>
            </div>
            
            <div className="p-8 rounded-lg shadow-md bg-white text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FaTasks className="text-orange-500 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                진행 상황 관리
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                공시 준비 과정을 체계적으로 관리하고 마감일을 놓치지 않도록 지원합니다.
              </p>
            </div>
          </div>
          
          {/* 대시보드 이미지들 - 하단에 나란히 배치 */}
          <div className="flex flex-col lg:flex-row gap-12 justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-3 rounded-xl">
                <img 
                  src="/images/dashboard-sample.png" 
                  alt="기후 리스크 분석 대시보드" 
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-3 rounded-xl">
                <img 
                  src="/images/dashboard-sample2.png" 
                  alt="재무 영향 분석 대시보드" 
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
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
