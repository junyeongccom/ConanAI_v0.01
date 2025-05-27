import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css";
import NavBar from "./components/NavBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Conan AI",
  description: "AI 기반 XBRL/DSD 공시 자동화 시스템 – 보고서 작성부터 검증까지 자동화합니다.",
  openGraph: {
    title: "Conan AI",
    description: "AI 기반 XBRL/DSD 공시 자동화 시스템 – 보고서 작성부터 검증까지 자동화합니다.",
    url: "https://conan.ai.kr",
    siteName: "Conan AI",
    images: [
      {
        url: "https://conan.ai.kr/og-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Conan AI 썸네일",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conan AI – XBRL / DSD 공시 자동화",
    description: "AI 기반 XBRL/DSD 공시 자동화 시스템 – 보고서 작성부터 검증까지 자동화합니다.",
    images: ["https://conan.ai.kr/og-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${poppins.variable} font-pretendard bg-white text-[#23272F] min-h-screen`}>
        <NavBar />
        <main className="min-h-[calc(100vh-64px)] bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
