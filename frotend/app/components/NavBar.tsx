"use client";

import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'About',
    children: [
      { label: 'ConanAI 이야기', href: '/about/intro' },
      { label: '도전의 역사', href: '/about/history' },
      { label: '보도자료', href: '/about/press' },
    ],
  },
  {
    label: 'Digital Solutions',
    children: [
      { label: 'See all digital solutions', href: '/solutions' },
      { label: '재무공시', href: '/solutions/finance' },
      { label: 'ESG공시', href: '/solutions/esg' },
    ],
  },
  {
    label: 'Guide',
    children: [
      { label: '재무공시 DSD 변환', href: '/guide/finance-dsd' },
      { label: 'ESG공시 DSD 변환', href: '/guide/esg-dsd' },
    ],
  },
  {
    label: 'IR',
    children: [
      { label: 'IR 활동', href: '/ir/activity' },
    ],
  },
];

export default function NavBar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav className="w-full border-b bg-white/90 backdrop-blur z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center px-6 py-3">
        <Link href="/" className="text-2xl font-extrabold tracking-tight flex items-center mr-8">
          <span className="text-[#00BCD4]">Conan</span>
          <span className="text-[#5D5FEF]">AI</span>
        </Link>
        <div className="flex gap-8 items-center relative">
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.label}
              className={`text-base font-semibold px-2 py-1 focus:outline-none bg-transparent ${openIndex === idx ? 'text-[#5D5FEF]' : 'text-gray-800 hover:text-[#5D5FEF]'}`}
              tabIndex={0}
              onClick={() => setOpenIndex(idx)}
              onMouseEnter={() => setOpenIndex(idx)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
      </div>
      {/* 전체 너비 드롭다운 */}
      {openIndex !== null && (
        <div
          className="absolute left-0 top-full w-full z-50"
          onMouseLeave={() => setOpenIndex(null)}
          onMouseEnter={() => {}}
        >
          <div className="w-full bg-white shadow-xl rounded-b-2xl border-t border-gray-100 flex justify-center animate-fadeIn">
            <div className="w-full max-w-5xl px-8 py-8 flex">
              <div className="flex-1 min-w-[200px]">
                <div className="text-xl font-bold text-gray-900 mb-4">{NAV_ITEMS[openIndex].label}</div>
                <div className="flex flex-col gap-2">
                  {NAV_ITEMS[openIndex].children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-2 py-2 rounded hover:bg-[#F5F6FA] text-gray-700 hover:text-[#5D5FEF] text-base transition-colors"
                      tabIndex={0}
                      onClick={() => setOpenIndex(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 