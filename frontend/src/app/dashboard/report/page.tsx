'use client';

import React, { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useReportStore } from '@/shared/store/reportStore';
import { Loader2, Terminal } from 'lucide-react';
import { ReportTable } from '@/shared/components/ui/ReportTable';

/**
 * 동적으로 생성된 보고서 콘텐츠를 렌더링하는 컴포넌트
 */
const ReportDisplay = () => {
  const { reportContent, isGenerating, error } = useReportStore();

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg text-gray-600">ESG 보고서를 생성하고 있습니다...</p>
        <p className="text-sm text-gray-500">잠시만 기다려 주세요. 최대 2분까지 소요될 수 있습니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5" />
          <h3 className="font-bold">오류 발생</h3>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }
  
  if (!reportContent) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold">보고서 생성 시작</h3>
        <p className="mt-2 text-gray-600">상단의 '보고서 생성' 버튼을 클릭하여 ESG 보고서 초안 생성을 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none bg-white p-6 sm:p-8 rounded-lg shadow-md mt-6">
      {reportContent.map((item, index) => {
        switch (item.type) {
          case 'heading_1':
            return <h1 key={index} className="text-3xl font-bold my-6 border-b pb-2">{item.content}</h1>;
          case 'heading_2':
            return <h2 key={index} className="text-2xl font-semibold my-5 mt-8">{item.content}</h2>;
          case 'heading_3':
            return <h3 key={index} className="text-xl font-medium my-4">{item.content}</h3>;
          case 'heading_4':
            return <h4 key={index} className="text-lg font-medium my-3 text-gray-800">{item.content}</h4>;
          case 'paragraph':
            return (
              <p key={index} className="whitespace-pre-wrap">
                {item.content}
              </p>
            );
          case 'table':
            if (!item.content?.headers || !item.content?.rows) return null;
            return (
              <ReportTable
                key={index}
                title={item.content.title}
                headers={item.content.headers}
                rows={item.content.rows}
              />
            );
          case 'error':
            return (
              <div role="alert" key={index} className="not-prose my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5" />
                  <h3 className="font-bold">콘텐츠 생성 오류</h3>
                </div>
                <p className="mt-2 text-sm">{item.content}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

/**
 * 보고서 생성 페이지
 * - 사용자가 보고서 생성을 요청하고 결과를 확인할 수 있는 UI
 */
export default function ReportPage() {
  const { isGenerating, generateReport, resetReport } = useReportStore();

  // 컴포넌트가 언마운트될 때 스토어 상태를 초기화
  useEffect(() => {
    return () => {
      resetReport();
    };
  }, [resetReport]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ESG 보고서 생성</h1>
          <p className="text-gray-600 mt-1">입력된 답변을 기반으로 AI가 ESG 보고서 초안을 생성합니다.</p>
        </div>
        <Button onClick={generateReport} disabled={isGenerating} size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              보고서 생성 중...
            </>
          ) : (
            '보고서 생성'
          )}
        </Button>
      </div>

      <ReportDisplay />
    </div>
  );
} 