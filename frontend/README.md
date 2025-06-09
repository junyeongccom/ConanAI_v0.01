# Sky-C Frontend - 기후리스크 재무영향 평가 시스템

기후리스크의 재무영향을 평가하는 TCFD 프레임워크 기반 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+ 
- pnpm (권장) 또는 npm/yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/junyeongccom/ConanAI_v0.01.git
cd ConanAI_v0.01/frontend
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
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 메인 페이지
│   │   └── climate-risk/      # 기후리스크 평가 페이지
│   ├── domain/                # 도메인별 비즈니스 로직
│   │   └── climate-risk/      # 기후리스크 관련 컴포넌트, 훅, 서비스
│   └── shared/                # 공유 컴포넌트 및 유틸리티
│       ├── components/        # 공통 컴포넌트
│       ├── styles/           # 글로벌 스타일
│       └── lib/              # 유틸리티 함수
├── public/                    # 정적 파일
├── tailwind.config.ts        # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
└── package.json             # 의존성 및 스크립트
```

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Maps**: Leaflet & React Leaflet
- **Charts**: Recharts
- **Package Manager**: pnpm

## 🌟 주요 기능

- 🌍 **지역별 기후리스크 분석**: 폭염, 수자원 부족, 태풍 등 다양한 기후위험 평가
- 📈 **재무영향 시나리오**: 기업 맞춤형 잠재적 재무영향과 리스크 시나리오 제공
- 📋 **TCFD 리포트 자동화**: TCFD 규제 준수 보고서 간편 생성
- 📱 **반응형 디자인**: 데스크톱, 태블릿, 모바일 모든 기기 지원

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

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. Node.js 버전이 18 이상인지 확인
2. `src/shared/lib/utils.ts` 파일이 존재하는지 확인
3. 모든 의존성이 올바르게 설치되었는지 확인

추가 도움이 필요하면 이슈를 생성해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 