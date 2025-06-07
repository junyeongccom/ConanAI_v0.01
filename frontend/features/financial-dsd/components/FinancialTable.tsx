"use client";

import React, { useState } from 'react';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { TableData } from '../types';

interface FinancialTableProps {
  data: TableData[];
  headers: string[];
}

export default function FinancialTable({ data, headers }: FinancialTableProps) {
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  // 숫자 포맷팅 함수 (백만원 단위)
  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || value === '') return '-';
    
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
    if (isNaN(num)) return value.toString();
    
    // 백만원 단위로 변환
    const millionValue = num / 1000000;
    return millionValue.toLocaleString('ko-KR', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 1 
    });
  };

  // 테이블 복사 함수
  const copyTableToClipboard = async () => {
    const visibleHeaders = showAllColumns ? headers : headers.slice(0, 6);
    const headerRow = visibleHeaders.join('\t');
    const dataRows = data.map(row => 
      visibleHeaders.map(header => {
        const value = row[header];
        return typeof value === 'number' ? formatNumber(value) : (value || '-');
      }).join('\t')
    ).join('\n');
    
    const tableText = headerRow + '\n' + dataRows;
    
    try {
      await navigator.clipboard.writeText(tableText);
      setCopiedCell('table');
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 셀 복사 함수
  const copyCellToClipboard = async (value: any, cellId: string) => {
    const textValue = typeof value === 'number' ? formatNumber(value) : (value || '-');
    try {
      await navigator.clipboard.writeText(textValue.toString());
      setCopiedCell(cellId);
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  const visibleHeaders = showAllColumns ? headers : headers.slice(0, 6);
  const hiddenColumnsCount = headers.length - visibleHeaders.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              재무제표 데이터
              <Badge variant="secondary">{data.length}개 항목</Badge>
            </CardTitle>
            <CardDescription>
              업로드된 재무제표 데이터를 확인하세요. (단위: 백만원)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hiddenColumnsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllColumns(!showAllColumns)}
                className="flex items-center gap-2"
              >
                {showAllColumns ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAllColumns ? '간단히 보기' : `전체 보기 (+${hiddenColumnsCount})`}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={copyTableToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {copiedCell === 'table' ? '복사됨!' : '테이블 복사'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {visibleHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="text-left p-3 font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {visibleHeaders.map((header, colIndex) => {
                    const value = row[header];
                    const cellId = `${rowIndex}-${colIndex}`;
                    const isNumeric = typeof value === 'number' || 
                      (typeof value === 'string' && !isNaN(parseFloat(value.replace(/,/g, ''))));
                    
                    return (
                      <td
                        key={colIndex}
                        className="p-3 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                        onClick={() => copyCellToClipboard(value, cellId)}
                        title="클릭하여 복사"
                      >
                        <div className="flex items-center justify-between">
                          <span className={isNumeric ? 'font-mono text-right' : ''}>
                            {isNumeric ? formatNumber(value) : (value || '-')}
                          </span>
                          <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity ml-2" />
                        </div>
                        {copiedCell === cellId && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                            복사됨!
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            표시할 데이터가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 