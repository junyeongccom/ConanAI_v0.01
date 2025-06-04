"use client";
import React from "react";
import Link from "next/link"; 


export default async function TemplatesPage() {
  return (
    <>
      <div className="grid grid-cols-12 gap-6 font-pretendard">
        <div className="lg:col-span-8 col-span-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">매출 및 이익 예측</h2>
            <div className="h-80 w-full">
              {/* 차트 영역 */}
              <div className="flex justify-between items-center h-full">
                <div className="w-1/12 flex flex-col justify-between h-full text-xs text-gray-500">
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>
                <div className="w-11/12 flex justify-between items-end h-full">
                  {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-t-sm" 
                           style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                      <span className="mt-2 text-xs text-gray-500">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="grid grid-cols-12 h-full items-stretch gap-6">
            <div className="col-span-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">신규 고객</h2>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">신규 목표</span>
                    <span className="text-sm font-bold">83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: "83%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">총 수입</h2>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">₩680,000</span>
                  <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded">+18%</span>
                </div>
                <div className="h-16">
                  <svg viewBox="0 0 100 20" className="w-full h-full">
                    <path d="M0,10 Q10,5 20,10 T40,10 T60,10 T80,5 T100,10" fill="none" stroke="#ec4899" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">제품 수익</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제품</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매량</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수익</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성장률</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: "제품 A", sales: "1,245", revenue: "₩32,500,000", growth: 15 },
                    { name: "제품 B", sales: "876", revenue: "₩21,300,000", growth: -2 },
                    { name: "제품 C", sales: "1,493", revenue: "₩45,200,000", growth: 8 },
                    { name: "제품 D", sales: "562", revenue: "₩12,700,000", growth: 22 }
                  ].map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.revenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${product.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {product.growth >= 0 ? `+${product.growth}%` : `${product.growth}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">일일 활동</h2>
            <div className="space-y-4">
              {[
                { time: "09:46", event: "John Doe로부터 ₩385,900 결제 수신", color: "blue" },
                { time: "09:46", event: "신규 판매 기록됨", color: "yellow" },
                { time: "10:12", event: "새 고객 등록", color: "green" },
                { time: "11:30", event: "시스템 업데이트 완료", color: "purple" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="text-sm text-gray-500">{activity.time}</div>
                    <div className={`w-3 h-3 mt-1 rounded-full bg-${activity.color}-500 ml-1`}></div>
                  </div>
                  <div className="text-sm">{activity.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 text-center mt-6">
          <p className="text-base text-gray-500">
          </p>
        </div>
      </div>
    </>
  );
} 