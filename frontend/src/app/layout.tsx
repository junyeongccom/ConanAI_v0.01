import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "@/shared/styles/globals.css";
import 'aos/dist/aos.css';
import Header from "@/shared/components/layout/Header/Header";
import AuthInitializer from "@/shared/components/AuthInitializer";
import AOSInitializer from "@/shared/components/AOSInitializer";

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
  themeColor: '#0070f3',
};

export const metadata: Metadata = {
  title: "Sky-C",
  description: "Sky-C - AWS 클라우드 개발 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sky-C",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Sky-C",
    description: "Sky-C - AWS 클라우드 개발 플랫폼",
    url: "https://sky-c.com",
    siteName: "Sky-C",
    images: [
      {
        url: "/og-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Sky-C 썸네일",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky-C - AWS 클라우드 개발 플랫폼",
    description: "Sky-C - AWS 클라우드 개발 플랫폼",
    images: ["/og-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon/favicon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sky-C" />
        <meta name="application-name" content="Sky-C" />
        <meta name="msapplication-TileColor" content="#0070f3" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${poppins.variable} font-pretendard bg-white text-[#23272F] min-h-screen overflow-x-hidden`}>
        <AuthInitializer />
        <AOSInitializer />
        <Header />
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
