"use client";

import React from "react";

// 엑셀 테이블 데이터 타입
interface TableData {
  [key: string]: any;
}

interface FinancialTableProps {
  tableData: TableData[];
  headers: string[];
}

export default function FinancialTable({ tableData, headers }: FinancialTableProps) {
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

  // 테이블 복사 함수
  const handleCopyTable = () => {
    const tableElement = document.getElementById('financial-table');
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

  if (!tableData.length || !headers.length) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4">
        <p className="text-blue-700 dark:text-blue-300">엑셀 파일과 시트 이름을 입력한 후 업로드해주세요.</p>
      </div>
    );
  }

  // 3번째 행(인덱스 2) 제거
  const filteredTableData = tableData.filter((row, index) => index !== 2);

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
      <table id="financial-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
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
} 