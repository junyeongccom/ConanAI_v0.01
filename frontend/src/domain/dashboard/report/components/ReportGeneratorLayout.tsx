'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal, Save, ArrowLeft } from 'lucide-react';
import { useReportGenerator } from '../hooks/useReportGenerator';
import { ReportContentItem } from '@/shared/store/reportStore';
import { ReportTable } from '@/shared/components/ui/ReportTable';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';


// --- 하위 컴포넌트들 ---

const ReportDisplay = ({ reportContent }: { reportContent: ReportContentItem[] }) => (
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
          return <p key={index} className="whitespace-pre-wrap">{item.content}</p>;
        case 'table':
          if (!item.content?.headers || !item.content?.rows) return null;
          return <ReportTable key={index} title={item.content.title} headers={item.content.headers} rows={item.content.rows} />;
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

const GenerationStatus = ({ isGenerating, error }: { isGenerating: boolean; error: string | null }) => {
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
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold">보고서 생성 시작</h3>
      <p className="mt-2 text-gray-600">상단의 '보고서 생성' 버튼을 클릭하여 ESG 보고서 초안 생성을 시작하세요.</p>
    </div>
  );
};

/**
 * @deprecated shadcn/ui Dialog 대신 window.prompt()를 사용하는 간단한 버전으로 대체됨
 */
// const SaveReportModal = ({ onSave, isSaving }: { onSave: (title: string) => void; isSaving: boolean }) => {
//     const [title, setTitle] = useState('');
//     const [open, setOpen] = useState(false);

//     const handleSaveClick = () => {
//         if (title.trim()) {
//             onSave(title.trim());
//             // 성공 시 다이얼로그가 닫히도록 관리할 수도 있지만,
//             // 저장 후 페이지 이동이 되므로 일단은 그대로 둡니다.
//             // setOpen(false); 
//         }
//     };
    
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button size="lg" disabled={isSaving}>
//             <Save className="mr-2 h-4 w-4" />
//             보고서 저장하기
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>보고서 저장</DialogTitle>
//             <DialogDescription>
//               보고서의 제목을 입력해주세요. 이 제목으로 목록에 표시됩니다.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="title" className="text-right">
//                 제목
//               </Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="col-span-3"
//                 placeholder="예: 2024년 1분기 ESG 보고서"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleSaveClick} disabled={!title.trim() || isSaving}>
//               {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               저장
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
// };


// --- 메인 레이아웃 컴포넌트 ---

export const ReportGeneratorLayout = () => {
  const {
    reportContent,
    isGenerating,
    error,
    generateReport,
    isSaving,
    handleSaveReport,
  } = useReportGenerator();
  const router = useRouter();

  const promptForReportTitleAndSave = () => {
    const title = window.prompt("저장할 보고서의 제목을 입력해주세요.", "예: 2024년 1분기 ESG 보고서");
    if (title && title.trim()) {
      handleSaveReport(title.trim());
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">새 보고서 생성</h1>
              <p className="text-gray-600 mt-1">입력된 답변을 기반으로 AI가 ESG 보고서 초안을 생성합니다.</p>
            </div>
        </div>
        <div className="flex gap-2">
            {!reportContent && (
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
            )}
            {reportContent && !isGenerating && (
                <Button onClick={promptForReportTitleAndSave} disabled={isSaving} size="lg">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            저장 중...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            보고서 저장하기
                        </>
                    )}
                </Button>
            )}
        </div>
      </div>
      
      {reportContent ? <ReportDisplay reportContent={reportContent} /> : <GenerationStatus isGenerating={isGenerating} error={error} />}
    </div>
  );
}; 