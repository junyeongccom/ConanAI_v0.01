'use client'

import { useState } from 'react'
import IRSummaryTable from '@/app/components/IRSummaryTable'

interface IRAnalysisData {
  investment_opinion?: {
    opinion?: string;
    target_price?: string;
    target_per?: string;
  };
  forecast?: {
    "2025F"?: {
      매출?: string;
      영업이익?: string;
    };
  };
  summary?: string;
}

export default function ReportAnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<IRAnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setData(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('PDF 파일을 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('https://railwayirsummary-production.up.railway.app/api/irsummary/pdfsummary', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`)
      }

      const json = await res.json()
      setData(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📄 IR 보고서 분석
          </h1>
          <p className="text-gray-600">
            PDF 파일을 업로드하여 투자 의견, 목표 주가, 재무 전망 등을 자동으로 분석합니다.
          </p>
        </div>

        {/* 업로드 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">파일 업로드</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IR 보고서 PDF 파일 선택
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-2"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  선택된 파일: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? '분석 중...' : '분석 요청'}
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">IR 보고서를 분석하고 있습니다...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
          </div>
        )}

        {/* 분석 결과 */}
        {data && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              📈 분석 결과 요약
            </h2>
            <IRSummaryTable data={data} />
          </div>
        )}

        {/* 사용 안내 */}
        {!data && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">사용 안내</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• PDF 형식의 IR 보고서 파일만 업로드 가능합니다.</li>
              <li>• 분석에는 몇 초에서 몇 분이 소요될 수 있습니다.</li>
              <li>• 투자의견, 목표주가, 재무전망 등의 정보가 자동으로 추출됩니다.</li>
              <li>• 분석 결과는 참고용이며, 투자 결정 시 신중히 검토하시기 바랍니다.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 