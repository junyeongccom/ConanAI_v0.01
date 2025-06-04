'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TemplatesPage() {
  const [chartHeights, setChartHeights] = useState<number[]>([]);

  useEffect(() => {
    const randomHeights = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 60 + 20)
    );
    setChartHeights(randomHeights);
  }, []);

  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // 활동 로그 데이터
  const activityLogs = [
    { time: "11:30", message: "시스템 업데이트 완료" },
    { time: "10:45", message: "Gin 포괄손익계산서_매출원가_분석자료 다운로드" },
    { time: "10:12", message: "Amuro 신규가입" },
    { time: "09:57", message: "Haibara 재무상태표_자산_유동자산_56기 수정" },
    { time: "09:46", message: "Conan Excel파일 업로드" },
    { time: "09:30", message: "Mori 시스템 접속" },
    { time: "09:15", message: "Ran 재무상태표 작성 시작" },
    { time: "08:50", message: "Kudo 주석 데이터 업데이트" },
    { time: "08:30", message: "일일 시스템 점검 완료" },
    { time: "08:00", message: "시스템 오픈" }
  ];

  // 보고서 생성 통계 데이터
  const reportStats = {
    totalReports: 328,
    successRate: 94.2,
    failureRate: 5.8,
  };

  // 최근 7일 보고서 생성 추이 데이터
  const weeklyReportData = [
    { name: '월', XBRL: 12, DSD: 8 },
    { name: '화', XBRL: 15, DSD: 10 },
    { name: '수', XBRL: 18, DSD: 12 },
    { name: '목', XBRL: 14, DSD: 9 },
    { name: '금', XBRL: 21, DSD: 15 },
    { name: '토', XBRL: 7, DSD: 4 },
    { name: '일', XBRL: 5, DSD: 3 },
  ];

  // 기업별 처리 현황 데이터
  const companyProcessData = [
    { 
      name: "삼성전자", 
      requestCount: 42, 
      status: "진행 중", 
      lastRequestDate: "2023-11-12",
      progress: 75
    },
    { 
      name: "LG전자", 
      requestCount: 28, 
      status: "완료", 
      lastRequestDate: "2023-11-10",
      progress: 100
    },
    { 
      name: "현대자동차", 
      requestCount: 35, 
      status: "진행 중", 
      lastRequestDate: "2023-11-15",
      progress: 60
    },
    { 
      name: "SK하이닉스", 
      requestCount: 19, 
      status: "검토 중", 
      lastRequestDate: "2023-11-14",
      progress: 30
    },
    { 
      name: "네이버", 
      requestCount: 23, 
      status: "완료", 
      lastRequestDate: "2023-11-08",
      progress: 100
    },
  ];

  // 추가 재무 지표 데이터
  const additionalFinancialData = [
    { category: "투자 효율성", items: "ROIC, ROI", values: "8.7%, 9.4%" },
    { category: "자산 건전성", items: "자기자본비율, 부채상환비율", values: "45.2%, 2.3배" },
    { category: "유동성 지표", items: "당좌비율, 현금비율", values: "88%, 25%" }
  ];

  // 처리 상태별 색상 설정
  const getStatusColor = (status: string) => {
    switch(status) {
      case "완료":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300";
      case "진행 중":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300";
      case "검토 중":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300";
    }
  };

  // 진행률에 따른 색상 설정
  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500 dark:bg-green-600";
    if (progress >= 75) return "bg-blue-500 dark:bg-blue-600";
    if (progress >= 50) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  return (
    <div className="grid grid-cols-3 gap-6 font-pretendard">
      {/* 왼쪽 영역 */}
      <div className="col-span-2 flex flex-col gap-6">
        {/* 주요 재무 지표 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">주요 재무 지표</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">지표 구분</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">주요 항목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">수치</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">수익성 지표</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">ROE, 영업이익률</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">14.2%, 11.3%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">안정성 지표</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">부채비율, 유동비율</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">112%, 98%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">성장성 지표</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">매출 증가율</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">13.5%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">활동성 지표</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">총자산회전율</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1.21회</td>
                </tr>
                {/* 추가 재무 지표 */}
                {additionalFinancialData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.values}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 기업별 처리 현황 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">기업별 처리 현황</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">기업명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">생성 요청 건수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">처리 상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">최신 요청일자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">진행률</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {companyProcessData.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{company.requestCount}건</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded ${getStatusColor(company.status)}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{company.lastRequestDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getProgressColor(company.progress)}`}
                          style={{ width: `${company.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                        {company.progress}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 오른쪽 영역 - 오른쪽 카드들은 그대로 유지 */}
      <div className="col-span-1">
        <div className="grid grid-cols-12 h-full items-stretch gap-6">
          {/* 사용자 접속 현황 */}
          <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">사용자 접속 현황</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* 총 사용자 수 */}
                <div className="col-span-3 md:col-span-1 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">총 사용자</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">1,245명</span>
                  </div>
                </div>
                
                {/* 오늘 로그인 */}
                <div className="col-span-3 md:col-span-1 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">오늘 로그인</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">87명</span>
                  </div>
                </div>
                
                {/* 오늘 업로드 */}
                <div className="col-span-3 md:col-span-1 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">오늘 업로드</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">32건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 보고서 생성 현황 */}
          <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">보고서 생성 현황</h2>
              
              {/* 통계 지표 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-1 flex flex-col items-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{reportStats.totalReports}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">총 생성 건수</div>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{reportStats.successRate}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">성공률</div>
                </div>
                <div className="col-span-1 flex flex-col items-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{reportStats.failureRate}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">실패율</div>
                </div>
              </div>
              
              {/* 차트 */}
              <div className="mt-4 h-44">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">최근 7일 생성 추이</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyReportData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="XBRL" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="DSD" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* 일일 활동 */}
          <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">일일 활동</h2>
              <div className="h-72 overflow-y-auto pr-2 custom-scrollbar">
                <ul className="space-y-3">
                  {activityLogs.map((log, index) => (
                    <li key={index} className="flex items-start py-2 px-3 border-l-4 border-indigo-500 bg-gray-50 dark:bg-gray-700/50 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="mr-3 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {log.time}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {log.message}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 저작권 */}
      <div className="col-span-3 text-center mt-6">
        <p className="text-base text-gray-500 dark:text-gray-400">
          天 재무 시스템 © 2025
        </p>
      </div>
    </div>
  );
}
