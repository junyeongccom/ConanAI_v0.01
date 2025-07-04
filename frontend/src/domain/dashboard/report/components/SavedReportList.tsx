'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2, FileText, AlertCircle, PlusCircle } from 'lucide-react';
import { useSavedReports } from '../hooks/useSavedReports';
import type { Route } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReportsSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                </CardFooter>
            </Card>
        ))}
    </div>
);

const NoReports = ({ onNavigate }: { onNavigate: () => void }) => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center p-4">
        <FileText className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg font-semibold text-gray-600">저장된 보고서가 없습니다.</p>
        <p className="text-gray-500 mt-1">새로운 ESG 보고서를 생성하고 관리해보세요.</p>
        <Button className="mt-4" onClick={onNavigate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 보고서 생성하기
        </Button>
    </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">오류 발생</p>
        <p>{error}</p>
    </div>
);

export const SavedReportList = () => {
  const { reports, isLoading, error, handleDeleteReport, handleNavigateToNewReport } = useSavedReports();

  if (isLoading) return <ReportsSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (reports.length === 0) return <NoReports onNavigate={handleNavigateToNewReport} />;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card key={report.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="truncate">{report.title}</CardTitle>
            <CardDescription>
              최종 수정일: {format(new Date(report.updated_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-sm text-muted-foreground">
              <p>상태: <span className="font-semibold text-primary">{report.status}</span></p>
              <p>생성일: {format(new Date(report.created_at), 'yyyy년 MM월 dd일', { locale: ko })}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/report/${report.id}` as Route} passHref>
              <Button variant="outline">보고서 보기</Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. '{report.title}' 보고서가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteReport(report.id)}>
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}; 