'use client';

import React, { useState } from 'react';
import { ReportMetadata } from '../models/types';
import { DEFAULT_CHAT_PROMPTS } from '../models/constants';

const TCFDReportLayout: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportMetadata | null>(null);
  const [reports, setReports] = useState<ReportMetadata[]>([
    // 예시 데이터 (나중에 실제 데이터로 대체)
    { 
      id: '1', 
      fileName: '2024 기후리스크 보고서 초안', 
      createdAt: '2024-06-01', 
      lastModifiedAt: '2024-06-10', 
      status: 'draft' 
    },
    { 
      id: '2', 
      fileName: '2023 폭염 영향 분석 보고서', 
      createdAt: '2023-08-15', 
      lastModifiedAt: '2023-08-20', 
      status: 'completed' 
    },
  ]);

  const [chatInput, setChatInput] = useState('');
  
  // 패널 토글 상태
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const handleSelectReport = (report: ReportMetadata) => {
    setSelectedReport(report);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // 여기에 채팅 메시지 전송 로직이 들어갈 예정
      console.log('메시지 전송:', chatInput);
      setChatInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setChatInput(prompt);
  };

  // 중앙 패널 너비 계산
  const getCenterPanelWidth = () => {
    if (!isLeftPanelOpen && !isRightPanelOpen) return 'w-full';
    if (isLeftPanelOpen && isRightPanelOpen) return 'w-1/2';
    return 'w-3/4';
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 pt-16">
      {/* Left Panel: Report List */}
      <aside className={`relative ${
        isLeftPanelOpen ? 'w-1/4' : 'w-0'
      } border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out ${isLeftPanelOpen ? 'overflow-hidden' : ''}`}>
        {isLeftPanelOpen && (
          <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">내 보고서</h2>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-700 transition-colors duration-200 font-medium">
              + 새 보고서 생성
            </button>
            
            {/* 검색 및 필터링 기능 */}
            <input
              type="text"
              placeholder="보고서 검색..."
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
                    selectedReport?.id === report.id 
                      ? 'bg-blue-100 border-blue-500 border shadow-sm' 
                      : 'bg-gray-50 hover:bg-blue-50 hover:shadow-sm'
                  }`}
                  onClick={() => handleSelectReport(report)}
                >
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{report.fileName}</h3>
                  <p className="text-sm text-gray-500">생성일: {report.createdAt}</p>
                  <p className="text-sm text-gray-500">수정일: {report.lastModifiedAt}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'draft' 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {report.status === 'draft' ? '초안' : '완료'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Left Panel Toggle Button */}
        <button
          className={`absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 hover:bg-gray-50 p-2 rounded-full shadow-md z-20 transition-all duration-200 ${
            isLeftPanelOpen ? '-right-3' : '-right-3'
          }`}
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          aria-label={isLeftPanelOpen ? '보고서 패널 닫기' : '보고서 패널 열기'}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLeftPanelOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </aside>

      {/* Center Panel: Report Content (Viewer/Editor) */}
      <main className={`${getCenterPanelWidth()} p-6 bg-white shadow-md overflow-y-auto transition-all duration-300 ease-in-out`}>
        {selectedReport ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedReport.fileName}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>생성일: {selectedReport.createdAt}</span>
                <span>•</span>
                <span>최종 수정: {selectedReport.lastModifiedAt}</span>
                <span>•</span>
                <span className={`font-medium ${
                  selectedReport.status === 'draft' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {selectedReport.status === 'draft' ? '초안' : '완료'}
                </span>
              </div>
            </div>
            
            {/* 보고서 내용 */}
            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800">
                  <strong>주의:</strong> 이 보고서는 AI가 생성한 내용입니다. 내용을 검토하고 필요에 따라 수정해주세요.
                </p>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. 개요</h2>
              <p className="text-gray-700 mb-4">
                본 보고서는 TCFD(Task Force on Climate-related Financial Disclosures) 프레임워크에 따라 
                기후 관련 재무 정보를 공시하기 위해 작성되었습니다.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. 물리적 리스크 분석</h2>
              <p className="text-gray-700 mb-4">
                폭염으로 인한 물리적 리스크를 분석한 결과, 다음과 같은 영향이 예상됩니다.
              </p>
              
              {/* 시각화 데이터 placeholder */}
              <div className="my-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                <div className="text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">지도 및 시각화 데이터</h3>
                <p className="text-sm text-gray-500">폭염일수, 재무영향 차트가 여기에 표시됩니다</p>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. 재무 영향</h2>
              <p className="text-gray-700 mb-4">
                각 문단의 근거 데이터 참조 기능과 함께 상세한 재무 영향 분석이 제공됩니다.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                <h3 className="font-semibold text-yellow-800 mb-2">📊 데이터 근거</h3>
                <p className="text-sm text-yellow-700">
                  이 섹션의 내용은 기상청 폭염일수 데이터와 산업별 영향 분석 모델을 기반으로 생성되었습니다.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">보고서를 선택해주세요</p>
              <p className="text-sm">왼쪽에서 보고서를 선택하거나 새로 생성해주세요.</p>
            </div>
          </div>
        )}
      </main>

      {/* Right Panel: Chatbot Interface */}
      <aside className={`relative ${
        isRightPanelOpen ? 'w-1/4' : 'w-0'
      } border-l border-gray-200 bg-white shadow-sm flex flex-col transition-all duration-300 ease-in-out ${isRightPanelOpen ? 'overflow-hidden' : ''}`}>
        {isRightPanelOpen && (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">TCFD 챗봇</h2>
            
            <div className="flex-grow overflow-y-auto border border-gray-300 rounded-md p-3 mb-4 bg-gray-50">
              {/* 채팅 메시지들 */}
              <div className="space-y-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-1">
                    <strong>TCFD 챗봇</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    안녕하세요! TCFD 보고서 생성을 도와드릴 챗봇입니다.
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    어떤 보고서를 생성하거나 수정하시겠어요? 
                    아래 자주 사용하는 프롬프트를 참고하시거나 직접 질문해주세요.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 채팅 입력 */}
            <div className="flex mb-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 transition-colors duration-200"
              >
                전송
              </button>
            </div>
            
            {/* 자주 사용하는 프롬프트 */}
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-2">자주 사용하는 프롬프트:</p>
              <div className="space-y-1">
                {DEFAULT_CHAT_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Right Panel Toggle Button */}
        <button
          className={`absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 hover:bg-gray-50 p-2 rounded-full shadow-md z-20 transition-all duration-200 ${
            isRightPanelOpen ? '-left-3' : '-left-3'
          }`}
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          aria-label={isRightPanelOpen ? '챗봇 패널 닫기' : '챗봇 패널 열기'}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRightPanelOpen ? "M9 19l7-7 7-7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </aside>
    </div>
  );
};

export default TCFDReportLayout; 