"use client";

import React, { useState } from "react";
import FinancialDsdUploader from "../../features/financial-dsd/components/FinancialDsdUploader";
import FinancialTable from "../../features/financial-dsd/components/FinancialTable";

// 엑셀 테이블 데이터 타입
interface TableData {
  [key: string]: any;
}

export default function FinancialDsdPage() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleDataLoaded = (data: TableData[], headerList: string[]) => {
    setTableData(data);
    setHeaders(headerList);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              재무 DSD
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ConanAI를 사용하여 IR전자공시 업무를 처리합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              DSD 데이터 생성
            </h2>
            
            <FinancialDsdUploader onDataLoaded={handleDataLoaded} />
            
            {/* 테이블 표시 영역 */}
            <div className="overflow-x-auto mt-6">
              <FinancialTable tableData={tableData} headers={headers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 