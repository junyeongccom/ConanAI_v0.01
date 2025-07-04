'use client';

import React from 'react';
import { useReportDetail } from '../hooks/useReportDetail';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal, ArrowLeft, AlertCircle, Edit, Save, XCircle } from 'lucide-react';
import { ReportContentItem } from '@/shared/store/reportStore';
import { ReportTable } from '@/shared/components/ui/ReportTable';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ReportDisplay = ({ 
  reportContent, 
  isEditing,
  onContentChange,
  onTableCellChange
}: { 
  reportContent: ReportContentItem[],
  isEditing: boolean,
  onContentChange: (index: number, newContent: string) => void,
  onTableCellChange: (itemIndex: number, rowIndex: number, cellIndex: number, newContent: string) => void;
}) => (
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
            if (isEditing) {
              return (
                <Textarea
                  key={index}
                  value={item.content || ''}
                  onChange={(e) => onContentChange(index, e.target.value)}
                  className="w-full text-base p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={Math.max(3, (item.content || '').split('\n').length)}
                />
              );
            }
            return <p key={index} className="whitespace-pre-wrap">{item.content || ''}</p>;
          case 'table':
            // 테이블 수정은 아직 지원하지 않음
            if (!item.content?.headers || !item.content?.rows) return null;
            return (
              <ReportTable 
                key={index} 
                title={item.content.title} 
                headers={item.content.headers} 
                rows={item.content.rows} 
                isEditing={isEditing}
                onCellChange={(rowIndex, cellIndex, value) => 
                  onTableCellChange(index, rowIndex, cellIndex, value)
                }
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

interface ReportDetailLayoutProps {
    reportId: string;
}

export const ReportDetailLayout = ({ reportId }: ReportDetailLayoutProps) => {
    const { 
      report, 
      isLoading, 
      error,
      isEditing,
      editedTitle,
      toggleEditing,
      handleTitleChange,
      handleContentChange,
      handleTableCellChange,
      handleSaveChanges,
      handleCancelEdit,
    } = useReportDetail(reportId);
    const router = useRouter();

    if (isLoading && !report) {
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg text-gray-600">보고서 내용을 불러오고 있습니다...</p>
          </div>
        );
    }

    if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">오류 발생</p>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                뒤로가기
            </Button>
          </div>
        );
    }
    
    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p>보고서를 찾을 수 없습니다.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    뒤로가기
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => !isEditing && router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                      {isEditing ? (
                        <Input 
                          value={editedTitle}
                          onChange={handleTitleChange}
                          className="text-2xl font-bold"
                        />
                      ) : (
                        <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
                      )}
                      <p className="text-sm text-gray-500">
                          최종 수정일: {format(new Date(report.updated_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                      </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveChanges} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        취소
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={toggleEditing} size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </Button>
                  )}
                </div>
            </div>
            
            <ReportDisplay 
              reportContent={report.report_data}
              isEditing={isEditing}
              onContentChange={handleContentChange}
              onTableCellChange={handleTableCellChange}
            />
        </div>
    );
} 