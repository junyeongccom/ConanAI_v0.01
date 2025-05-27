// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Tabs from './components/Tabs';
import Link from 'next/link';
import ChatbotLauncher from './components/ChatbotLauncher';

const SLIDES = [
  { label: '업계 주가', href: '/features/stock' },
  { label: '재무 DSD', href: '/dashboard/table/separate-balancesheet' },
  { label: '증권리포트 분석', href: '/features/report-analysis' },
  { label: 'ESG DSD', href: '/features/esg-dsd' },
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('financial');
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = (path: string) => {
    router.push(path);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({ left: dir === 'left' ? -width / 1.5 : width / 1.5, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="mt-20 mb-4 text-4xl md:text-5xl font-extrabold text-center">
        오늘은 어떤 업무를 <span className="text-[#5D5FEF]">자동화</span>할까요?
      </div>
      <div className="mb-10 text-lg md:text-2xl text-center text-gray-500 font-medium">
        ConanAI를 사용하면 IR팀·재무팀 업무가 쉬워집니다.
      </div>
      <div className="relative w-full max-w-4xl px-4">
        <button
          aria-label="왼쪽"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-[#F5F6FA]"
          onClick={() => scroll('left')}
        >
          <svg width="24" height="24" fill="none" stroke="#5D5FEF" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar py-2 px-2 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {SLIDES.map((slide) => (
            <Link
              key={slide.href}
              href={slide.href}
              className="flex-shrink-0 w-56 h-40 bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col items-center justify-center text-xl font-semibold text-[#23272F] hover:text-[#5D5FEF] hover:border-[#5D5FEF] transition-colors duration-200 cursor-pointer select-none"
              style={{ scrollSnapAlign: 'center' }}
            >
              {slide.label}
            </Link>
          ))}
        </div>
        <button
          aria-label="오른쪽"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-[#F5F6FA]"
          onClick={() => scroll('right')}
        >
          <svg width="24" height="24" fill="none" stroke="#5D5FEF" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <ChatbotLauncher />
    </div>
  );
}
