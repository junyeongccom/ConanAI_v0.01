"use client";

import React from 'react';
import { HeatwaveData } from '../types';
import { getRiskLevel } from '../services/utils';

interface ClimateRiskTableProps {
  heatwaveData: HeatwaveData[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ClimateRiskTable({
  heatwaveData,
  loading,
  error,
  onRetry
}: ClimateRiskTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!heatwaveData.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              연도
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              폭염일수 (일)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              변화량 (일)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              변화율 (%)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              위험도
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {heatwaveData.map((item, index) => {
            const risk = getRiskLevel(item.change_rate);
            const isCurrentClimate = item.year === '현재기후';
            
            return (
              <tr key={index} className={`hover:bg-gray-50 ${isCurrentClimate ? 'bg-blue-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {isCurrentClimate ? '현재기후 (기준)' : item.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.heatwave_days.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isCurrentClimate ? '-' : `+${item.change_days.toFixed(1)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isCurrentClimate ? '-' : `+${item.change_rate.toFixed(1)}%`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isCurrentClimate ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      기준값
                    </span>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${risk.color}`}>
                      {risk.level}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 