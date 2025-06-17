/** @type {import('next').NextConfig} */
const path = require('path')

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV !== 'production',
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: '/offline.html',
  },
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
})

const nextConfig = {
  // output: 'standalone' 제거 - Windows symlink 권한 문제 해결
  
  // src 디렉토리 명시적 지원
  experimental: {
    typedRoutes: true,
  },
  
  // 절대 경로 alias 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    }
    
    // Leaflet 관련 설정 (SSR 이슈 해결)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // 이미지 최적화 설정
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // 명시적으로 src 디렉토리 사용 설정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = withPWA(nextConfig)
