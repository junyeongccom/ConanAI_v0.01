# Sky-C Frontend - ISSB S2 기후공시 자동화 시스템

IFRS S2 기후공시 규제 대응을 위한 AI 기반 자동화 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+ 
- pnpm 9.0.0+ (권장) 또는 npm/yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/junyeongccom/SKY-C_v0.01.git
cd SKY-C_v0.01/frontend
```

2. **의존성 설치**
```bash
# pnpm 사용 (권장)
pnpm install

# 또는 npm 사용
npm install

# 또는 yarn 사용
yarn install
```

3. **개발 서버 실행**
```bash
# pnpm 사용
pnpm dev

# 또는 npm 사용
npm run dev

# 또는 yarn 사용
yarn dev
```

4. **브라우저에서 확인**
   - http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router 페이지
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 메인 랜딩 페이지
│   │   ├── auth/                    # 인증 관련 페이지
│   │   │   ├── callback/            # Google OAuth 콜백
│   │   │   ├── success/             # 로그인 성공
│   │   │   └── error/               # 로그인 실패
│   │   ├── login/                   # 로그인 페이지
│   │   ├── dashboard/               # 대시보드 (메인 작업 공간)
│   │   │   ├── home/                # 대시보드 홈
│   │   │   ├── indicators/          # ISSB S2 지표 입력
│   │   │   └── layout.tsx           # 대시보드 레이아웃
│   │   ├── basic/                   # 기본 정보 페이지
│   │   │   ├── concepts/            # 기후공시 개념 설명
│   │   │   └── adoption-status/     # ISSB 도입 현황
│   │   ├── service/                 # 핵심 서비스 페이지
│   │   │   ├── climate-risk/        # 지역별 기후리스크 평가
│   │   │   ├── report/              # 재무영향 보고서 생성
│   │   │   └── tcfd-report/         # TCFD 보고서 생성
│   │   ├── report/                  # 보고서 관리
│   │   ├── my-page/                 # 마이페이지
│   │   └── about/                   # 프로젝트 소개
│   │       ├── project/             # 프로젝트 정보
│   │       └── developer/           # 개발자 정보
│   ├── domain/                      # 도메인별 비즈니스 로직
│   │   ├── auth/                    # 인증 관련
│   │   ├── dashboard/               # 대시보드 관련
│   │   │   ├── home/                # 대시보드 홈 컴포넌트
│   │   │   └── indicators/          # ISSB S2 지표 입력 시스템
│   │   ├── service/                 # 핵심 서비스
│   │   │   ├── climate-risk/        # 기후리스크 분석
│   │   │   ├── report/              # 재무영향 보고서
│   │   │   └── tcfd-report/         # TCFD 보고서
│   │   ├── basic/                   # 기본 정보 컴포넌트
│   │   ├── login/                   # 로그인 컴포넌트
│   │   ├── my-page/                 # 마이페이지 컴포넌트
│   │   ├── report/                  # 보고서 관리 컴포넌트
│   │   └── about/                   # 소개 페이지 컴포넌트
│   └── shared/                      # 공유 컴포넌트 및 유틸리티
│       ├── components/              # 공통 컴포넌트
│       │   ├── common/              # 기본 컴포넌트 (로고, 네비게이션 등)
│       │   ├── layout/              # 레이아웃 컴포넌트
│       │   ├── ui/                  # UI 컴포넌트 (Radix UI 기반)
│       │   └── visualization/       # 시각화 컴포넌트
│       ├── constants/               # 상수 정의
│       ├── hooks/                   # 공용 React 훅
│       ├── lib/                     # 유틸리티 함수
│       ├── services/                # API 서비스
│       ├── store/                   # 전역 상태 관리 (Zustand)
│       └── styles/                  # 글로벌 스타일
├── public/                         # 정적 파일
│   ├── images/                     # 이미지 파일
│   ├── maps/                       # 지도 데이터 (GeoJSON)
│   ├── pdf/                        # PDF 파일
│   └── videos/                     # 동영상 파일
├── tailwind.config.ts              # Tailwind CSS 설정
├── tsconfig.json                   # TypeScript 설정
└── package.json                    # 의존성 및 스크립트
```

## 🛠️ 기술 스택

### 핵심 프레임워크
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: pnpm

### UI/UX
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React, React Icons
- **Animations**: Framer Motion, AOS
- **Particles**: React TSParticles

### 상태 관리 & 데이터
- **State Management**: Zustand (with persistence)
- **HTTP Client**: Axios
- **Authentication**: JWT, Google OAuth

### 지도 & 시각화
- **Maps**: Leaflet & React Leaflet
- **Charts**: Recharts
- **Lottie**: Lottie React

### 기타
- **PWA**: Next PWA
- **Theme**: Next Themes
- **Image Optimization**: Sharp

## 🌟 주요 기능

### 1. 🔐 인증 시스템
- **Google OAuth 로그인**: 간편한 소셜 로그인
- **JWT 기반 인증**: 안전한 토큰 기반 인증
- **자동 로그인 유지**: 세션 관리 및 자동 갱신

### 2. 📊 ISSB S2 지표 입력 시스템
- **체계적인 지표 관리**: IFRS S2 요구사항에 따른 구조화된 입력
- **다양한 입력 유형 지원**:
  - 텍스트 입력 (단문/장문)
  - 숫자 입력
  - 테이블 입력 (동적 행 생성)
  - 구조화된 리스트
  - 온실가스 배출량 계산기
- **실시간 데이터 저장**: Zustand 기반 상태 관리로 자동 저장
- **진행률 추적**: 카테고리별 완료 상태 모니터링

### 3. 🌍 지역별 기후리스크 평가
- **인터랙티브 지도**: Leaflet 기반 한국 지역별 리스크 시각화
- **다중 시나리오 분석**: SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5
- **시계열 데이터**: 2025~2050년 예측 데이터
- **리스크 유형별 분석**:
  - 폭염일수
  - 수자원 부족
  - 태풍 강도
  - 해수면 상승

### 4. 💰 재무영향 분석
- **리스크 기반 재무 모델링**: 기후 리스크의 재무적 영향 계산
- **시나리오별 손실 추정**: 다양한 기후 시나리오에 따른 잠재 손실
- **업종별 맞춤 분석**: 산업 특성을 고려한 영향 평가

### 5. 📋 TCFD 보고서 자동 생성
- **AI 기반 문서 생성**: 입력 데이터 기반 자동 보고서 작성
- **TCFD 프레임워크 준수**: 4대 영역 (지배구조, 전략, 위험관리, 지표 및 목표)
- **PDF 내보내기**: 완성된 보고서 다운로드

### 6. 📚 기본 정보 제공
- **ISSB 도입 현황**: 전 세계 국가별 도입 상태 시각화
- **기후공시 개념**: 핵심 용어 및 개념 설명
- **세계 지도 시각화**: 국가별 도입 현황 인터랙티브 맵

### 7. 🎯 대시보드 & 관리
- **통합 대시보드**: 전체 진행 상황 한눈에 보기
- **마이페이지**: 사용자 정보 및 설정 관리
- **보고서 관리**: 생성된 보고서 목록 및 관리

## 🎨 UI/UX 특징

- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **다크/라이트 모드**: 사용자 선호에 따른 테마 전환
- **애니메이션**: 부드러운 페이지 전환 및 인터랙션
- **접근성**: WCAG 가이드라인 준수
- **PWA 지원**: 모바일 앱처럼 설치 및 사용 가능

## 🔧 문제 해결

### 일반적인 문제들

1. **모듈을 찾을 수 없는 오류**
   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   pnpm install
   ```

2. **TypeScript 오류**
   ```bash
   # TypeScript 캐시 정리
   rm -rf .next
   pnpm dev
   ```

3. **포트 충돌**
   ```bash
   # 다른 포트로 실행
   pnpm dev -- -p 3001
   ```

### 백엔드 연동 문제

1. **API 연결 실패**
   - 백엔드 서비스가 실행 중인지 확인
   - CORS 설정 확인
   - 환경 변수 설정 확인

2. **인증 문제**
   - Google OAuth 설정 확인
   - JWT 토큰 만료 시간 확인

### 의존성 관련 문제

프로젝트 클론 후 오류가 발생한다면:

1. Node.js 버전 확인 (18+ 필요)
2. 패키지 매니저 재설치
3. 캐시 정리 후 재설치

```bash
# pnpm 캐시 정리
pnpm store prune

# npm 캐시 정리
npm cache clean --force
```

## 🔌 백엔드 연동

### API 엔드포인트
- **Auth Service**: http://localhost:8084
- **Disclosure Service**: http://localhost:8083
- **Climate Service**: http://localhost:8087
- **Report Service**: http://localhost:8082
- **Gateway**: http://localhost:8080

### 환경 변수 설정
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📱 PWA 기능

- **오프라인 지원**: 캐시된 데이터로 오프라인 작업 가능
- **앱 설치**: 홈 화면에 앱 아이콘 추가
- **푸시 알림**: 중요 업데이트 알림 (향후 구현 예정)

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. Node.js 버전이 18 이상인지 확인
2. 모든 의존성이 올바르게 설치되었는지 확인
3. 백엔드 서비스가 정상 실행 중인지 확인
4. 환경 변수가 올바르게 설정되었는지 확인

추가 도움이 필요하면 GitHub Issues를 통해 문의해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 