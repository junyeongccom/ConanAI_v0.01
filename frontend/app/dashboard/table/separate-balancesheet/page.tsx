"use client";

import React, { useState } from "react";

// 엑셀 테이블 데이터 타입
interface TableData {
  [key: string]: any;
}

// API 응답 타입
interface DsdUploadResponse {
  filename: string;
  sheets: {
    [sheetName: string]: TableData[];
  };
}

// XBRL 변환 응답 타입
interface XbrlUploadResponse {
  status: string;
  xbrl_path: string;
}

// OpenDART API 응답 타입
interface OpenDartResponse {
  status: string;
  data: {
    corp_name: string;
    corp_code: string;
    stock_code: string;
    [key: string]: any;
  }[];
}

export default function SeparateBalanceSheetPage() {
  // DSD 상태 관리
  const [dsdLoading, setDsdLoading] = useState<boolean>(false);
  const [dsdError, setDsdError] = useState<string | null>(null);
  const [dsdFile, setDsdFile] = useState<File | null>(null);
  const [dsdFileName, setDsdFileName] = useState<string>("");
  const [sheetName, setSheetName] = useState<string>("");
  const [dsdTableData, setDsdTableData] = useState<TableData[]>([]);
  const [dsdHeaders, setDsdHeaders] = useState<string[]>([]);
  const [dsdInfo, setDsdInfo] = useState<string | null>(null);

  // 숫자 포맷팅 함수 (백만 단위 변환 및 3자리 콤마 추가)
  const formatNumber = (num: number | string | null | undefined): string => {
    if (num === null || num === undefined || num === "") return "";
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return "";
    const millionValue = numValue / 1000000;
    return new Intl.NumberFormat('ko-KR').format(millionValue);
  };

  // 공백 개수 계산 및 &nbsp; 변환 함수
  const convertSpacesToNbsp = (text: string): React.ReactNode => {
    if (!text) return '';
    let leadingSpaces = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        leadingSpaces++;
      } else {
        break;
      }
    }
    const actualText = text.trimStart();
    let spaces = '';
    for (let i = 0; i < leadingSpaces; i++) {
      spaces += '\u00A0';
    }
    return <>{spaces}{actualText}</>;
  };

  // DSD 파일 업로드 핸들러
  const handleDsdFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDsdFile(file);
      setDsdFileName(file.name);
    }
  };

  // DSD API 요청 핸들러
  const handleDsdUpload = async () => {
    setDsdInfo(null);
    if (!dsdFile) {
      setDsdError("먼저 엑셀 파일을 선택해주세요.");
      return;
    }
    if (!sheetName) {
      setDsdInfo("시트명을 입력하지 않으면 자동으로 모든 시트가 변환됩니다.");
    }
    setDsdLoading(true);
    setDsdError(null);
    const formData = new FormData();
    formData.append('file', dsdFile);
    // sheetName이 비어있으면 쿼리스트링에서 sheet_name 파라미터를 빼고 요청
    let url = 'https://railwaydsdgen-production.up.railway.app/dsdgen/upload';
    if (sheetName) {
      url += `?sheet_name=${sheetName}`;
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      const data: DsdUploadResponse = await response.json();
      if (sheetName) {
        if (data.sheets && data.sheets[sheetName] && data.sheets[sheetName].length > 0) {
          const tableData = data.sheets[sheetName];
          setDsdTableData(tableData);
          if (tableData.length > 0) {
            setDsdHeaders(Object.keys(tableData[0]));
          }
        } else {
          throw new Error("시트 데이터가 없습니다.");
        }
      } else {
        // 시트명이 없으면 첫 번째 시트의 데이터를 보여줌
        const sheetNames = Object.keys(data.sheets);
        if (sheetNames.length > 0) {
          const firstSheet = sheetNames[0];
          const tableData = data.sheets[firstSheet];
          setDsdTableData(tableData);
          if (tableData.length > 0) {
            setDsdHeaders(Object.keys(tableData[0]));
          }
        } else {
          throw new Error("시트 데이터가 없습니다.");
        }
      }
    } catch (error) {
      console.error("DSD 업로드 오류:", error);
      setDsdError(error instanceof Error ? error.message : "DSD 업로드 중 오류가 발생했습니다.");
    } finally {
      setDsdLoading(false);
    }
  };

  // 재무제표 테이블 렌더링 함수
  const renderBalanceSheetTable = (
    tableData: TableData[],
    headers: string[]
  ): React.ReactElement => {
    if (!tableData.length || !headers.length) {
      return <></>;
    }
    const filteredTableData = tableData.filter((row, index) => index !== 2);
    // 테이블 복사 함수
    const handleCopyTable = () => {
      const tableElement = document.getElementById('dsd-table');
      if (!tableElement) return;
      try {
        const range = document.createRange();
        range.selectNode(tableElement);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        const success = document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
        if (success) {
          alert('표가 복사되었습니다!');
        } else {
          alert('복사 실패');
        }
      } catch (err) {
        alert('복사 실패');
      }
    };
    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '5px' }}>
          <span style={{ fontFamily: '굴림', fontSize: '10pt', color: 'buttontext' }}>
            (단위: 백만원)
          </span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={handleCopyTable}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: '굴림'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            표 전체 복사
          </button>
        </div>
        <table id="dsd-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <td
                  key={index}
                  className="default"
                  valign="middle"
                  align={index === 0 ? "left" : "right"}
                  style={{
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    paddingLeft: index === 0 ? "20px" : "5px",
                    paddingRight: "5px",
                    border: "1px solid #999"
                  }}
                >
                  <span style={{ fontFamily: "굴림", fontSize: "11pt", color: "buttontext" }}>
                    {header}
                  </span>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="default"
                    valign="middle"
                    align={colIndex === 0 ? "left" : "right"}
                    style={{
                      paddingBottom: "5px",
                      paddingTop: "5px",
                      paddingLeft: colIndex === 0 ? "20px" : "5px",
                      paddingRight: "5px",
                      border: "1px solid #999"
                    }}
                  >
                    <span style={{ fontFamily: "굴림", fontSize: "11pt", color: "buttontext" }}>
                      {colIndex === 0 
                        ? convertSpacesToNbsp(row[header]) 
                        : formatNumber(row[header])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">DSD 데이터 생성</h1>
        {/* 에러 메시지 */}
        {dsdError && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            <p>{dsdError}</p>
          </div>
        )}
        {/* 안내 메시지 */}
        {dsdInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 mb-4">
            <p className="text-blue-700 dark:text-blue-300">{dsdInfo}</p>
          </div>
        )}
        {/* 로딩 인디케이터 */}
        {dsdLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              엑셀 파일 업로드
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center justify-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                <span>파일 선택</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleDsdFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {dsdFileName || "선택된 파일 없음"}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시트 이름
            </label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="예: D210000"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            onClick={handleDsdUpload}
            disabled={dsdLoading}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
          >
            업로드 및 변환
          </button>
        </div>
        {/* 테이블 표시 영역 */}
        {dsdTableData.length > 0 && dsdHeaders.length > 0 ? (
          <div className="overflow-x-auto mt-6">
            {renderBalanceSheetTable(dsdTableData, dsdHeaders)}
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4">
            <p className="text-blue-700 dark:text-blue-300">엑셀 파일과 시트 이름을 입력한 후 업로드해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
} 