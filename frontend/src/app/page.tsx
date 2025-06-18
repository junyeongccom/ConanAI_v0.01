// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { 
  FaRobot, 
  FaChartLine, 
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaChartPie,
  FaUsers,
  FaLeaf,
  FaFileAlt,
  FaDatabase,
  FaUpload
} from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* 1. 히어로 섹션 */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-cyan-500 text-white flex items-center overflow-hidden">
        {/* 배경 애니메이션 요소들 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-white/8 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
          <div className="absolute top-60 left-1/2 w-12 h-12 bg-white/12 rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        </div>
        
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* 히어로 콘텐츠 */}
        <div className="relative z-10 w-full py-20 px-4 pt-32">
          <div className="max-w-7xl mx-auto text-center">
            <h1 
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              ESG 의무공시 시대
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ISSB, 지금부터 준비하세요
              </span>
            </h1>
            <p 
              className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              AI 기반 자동화로 빠르게 IFRS S2 보고서 초안을 지금 바로 생성하세요.
              <br />
              사용자는 데이터 입력만, 보고서 문단 생성은 AI가 수행하는 차세대 솔루션입니다.
            </p>
            <div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
                             <Link 
                 href="/dashboard"
                 className="group bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:from-blue-50 hover:to-white py-4 px-10 rounded-full font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 flex items-center gap-3 text-lg"
               >
                 보고서 생성 시작
                 <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
               </Link>
              <button
                onClick={() => handleScrollToSection('why-now')}
                className="group text-white border-2 border-white/50 hover:bg-white/20 hover:border-white py-4 px-10 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-3 text-lg"
              >
                Sky-C 자세히 알아보기
                <FaLeaf className="text-sm group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* 스크롤 다운 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. "왜 지금 준비해야 하는가?" 섹션 */}
      <section id="why-now" className="relative py-20 px-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-800 to-blue-800 bg-clip-text text-transparent">
              왜 ISSB S2에 따른 공시대응을
              <br />
              미리 준비해야 하는가?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              선제적 대응이 가져다주는 경쟁 우위를 확인하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FaUsers,
                title: "투자자의 최우선 요구",
                description: "ESG 투자가 주류가 되면서 투자자들이 기후 관련 재무 정보 공시를 필수적으로 요구하고 있습니다. 투명한 공시는 투자 유치의 핵심 요소입니다.",
                gradient: "from-blue-500 to-cyan-500",
                delay: "100"
              },
              {
                icon: FaChartPie,
                title: "재무적 가치에 직접적인 영향",
                description: "기후 리스크와 기회를 제대로 관리하지 못하면 기업 가치 평가에 부정적 영향을 미칠 수 있습니다. 선제적 대응은 가치 상승의 기회입니다.",
                gradient: "from-green-500 to-emerald-500",
                delay: "200"
              },
              {
                icon: FaShieldAlt,
                title: "규제 의무화의 확산",
                description: "전 세계적으로 ISSB 도입이 가속화되고 있으며, 조기 준비가 경쟁 우위를 가져다줍니다. 규제 변화에 앞서 대비하는 것이 현명합니다.",
                gradient: "from-purple-500 to-pink-500",
                delay: "300"
              },
              {
                icon: FaGlobe,
                title: "시장 경쟁력 확보",
                description: "투명한 기후공시는 이해관계자 신뢰를 높이고 글로벌 시장에서의 경쟁력을 강화합니다. 지속가능한 성장의 기반이 됩니다.",
                gradient: "from-orange-500 to-red-500",
                delay: "400"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-10 rounded-3xl bg-white/80 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={item.delay}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <item.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="500">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                                  href="/basic/adoption-status"
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
              >
                ISSB 도입 현황 자세히 보기
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                                  href="/basic/concepts"
                className="group bg-white/80 backdrop-blur-sm text-gray-800 py-4 px-8 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 flex items-center gap-3"
              >
                기후공시 개념 알아보기
                <FaLeaf className="text-sm group-hover:rotate-12 transition-transform duration-300 text-green-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 핵심 기능 개요 섹션 */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Sky-C가 제공하는 핵심 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AI 기반 자동화로 복잡한 기후공시를 간단하게
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: FaRobot,
                title: "AI 자동화 보고서",
                description: "사용자가 입력한 데이터를 기반으로 AI가 자동으로 보고서 초안을 생성합니다.",
                gradient: "from-blue-500 to-purple-500",
                delay: "100"
              },
              {
                icon: FaUpload,
                title: "간편한 데이터 입력",
                description: "직관적인 인터페이스로 누구나 쉽게 기후 관련 데이터를 입력할 수 있습니다.",
                gradient: "from-green-500 to-teal-500",
                delay: "200"
              },
              {
                icon: FaDatabase,
                title: "실시간 분석 대시보드",
                description: "기후 관련 물리적 리스크를 지역별로 모니터링하고 분석할 수 있습니다.",
                gradient: "from-purple-500 to-pink-500",
                delay: "300"
              },
              {
                icon: FaFileAlt,
                title: "진행 상황 관리",
                description: "공시 준비 과정을 체계적으로 관리하고 마감일을 놓치지 않도록 지원합니다.",
                gradient: "from-orange-500 to-red-500",
                delay: "400"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white/90 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 text-center"
                data-aos="fade-up"
                data-aos-delay={item.delay}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <item.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            ))}
          </div>
          
          {/* 대시보드 이미지들 */}
          <div className="flex flex-col lg:flex-row gap-12 justify-center items-center" data-aos="fade-up" data-aos-delay="500">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <Image 
                  src="/images/dashboard-sample.png" 
                  alt="기후 리스크 분석 대시보드" 
                  width={500}
                  height={300}
                  className="w-full max-w-lg h-auto rounded-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <Image 
                  src="/images/dashboard-sample2.png" 
                  alt="재무 영향 분석 대시보드" 
                  width={500}
                  height={300}
                  className="w-full max-w-lg h-auto rounded-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 최종 CTA 섹션 */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-20 px-4 overflow-hidden">
        {/* 배경 애니메이션 요소들 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full animate-pulse" style={{ animationDelay: '4s', animationDuration: '5s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            지금 바로 Sky-C와 함께
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              기후공시의 미래를 경험하세요
            </span>
          </h2>
          <p 
            className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            더 이상 복잡한 준비 과정으로 고민하지 마세요. 
            <br />
            Sky-C의 솔루션으로 IFRS S2 대응을 시작하세요.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
                         <Link 
               href="/dashboard"
               className="group bg-white text-blue-600 hover:bg-blue-50 py-5 px-12 rounded-full font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-white/25 flex items-center gap-4 text-xl"
             >
               지금 시작하기
               <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
             </Link>
            <Link 
              href="/dashboard"
              className="group text-white border-2 border-white/70 hover:bg-white/20 hover:border-white py-5 px-12 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-4 text-xl"
            >
              대시보드 둘러보기
              <FaChartLine className="group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>

          
        </div>
      </section>
    </div>
  );
}
