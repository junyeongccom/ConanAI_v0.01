# Sky-C: AWS 클라우드 기반 기후리스크 평가 시스템

> **Domain-Driven Design (DDD)** 원칙과 **Microservices Architecture (MSA)** 패턴을 적용한 확장 가능한 클라우드 네이티브 애플리케이션

## 🏗️ 아키텍처 개요

Sky-C는 **모노레포(Monorepo)** 방식으로 구성된 마이크로서비스 아키텍처 기반의 기후리스크 평가 시스템입니다. **Domain-Driven Design (DDD)** 원칙을 적용하여 비즈니스 도메인 중심의 설계를 구현하고, **API Gateway 패턴**을 통한 서비스 디스커버리와 라우팅을 제공합니다.

### 🎯 설계 철학

1. **Domain-Driven Design (DDD)**
   - 비즈니스 도메인을 중심으로 한 설계
   - 도메인 모델과 비즈니스 로직의 분리
   - 명확한 바운디드 컨텍스트 정의

2. **Microservices Architecture (MSA)**
   - 서비스별 독립적인 배포와 확장
   - 느슨한 결합과 높은 응집도
   - 서비스 간 API 기반 통신

3. **확장성 우선 설계**
   - 모듈화된 컴포넌트 구조
   - 플러그인 방식의 기능 확장
   - 클라우드 네이티브 패턴 적용

## 📁 프로젝트 구조

```
sky-c/
├── 🎨 frontend/                    # Next.js 15 + TypeScript (포트: 3000)
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 13+)
│   │   │   └── climate-risk/      # 기후리스크 도메인
│   │   │       ├── components/    # 도메인 컴포넌트
│   │   │       ├── hooks/         # 도메인 훅
│   │   │       ├── services/      # API 서비스
│   │   │       ├── store/         # 상태 관리
│   │   │       └── types.ts       # 타입 정의
│   │   └── shared/                # 공통 컴포넌트 및 유틸리티
│   │       ├── components/        # 재사용 가능한 UI 컴포넌트
│   │       ├── hooks/             # 공통 훅
│   │       ├── styles/            # 글로벌 스타일
│   │       └── utils/             # 유틸리티 함수
│   ├── public/                    # 정적 자산
│   ├── next.config.js             # Next.js 설정
│   └── tailwind.config.ts         # Tailwind CSS 설정
│
├── 🚪 gateway-service/             # API Gateway (포트: 8080)
│   └── app/
│       ├── api/                   # API 라우터
│       ├── domain/                # 도메인 모델
│   │   └── model/
│   │       ├── service_type.py      # 서비스 타입 정의
│   │       └── service_factory.py   # 서비스 팩토리
│   ├── middleware/            # 미들웨어
│   ├── config/                # 설정
│   └── main.py                # FastAPI 애플리케이션
│
├── 🤖 chatbot-service/             # 챗봇 서비스 (포트: 8081)
│   └── app/
│       ├── api/                   # API 엔드포인트
│       ├── domain/                # 도메인 로직
│       └── main.py                # FastAPI 애플리케이션
│
├── 💰 finimpact-service/          # 재무영향 분석 서비스 (포트: 8082)
│   └── app/
│       ├── api/                   # API 엔드포인트
│       ├── domain/                # 도메인 로직
│       │   ├── controller/        # 컨트롤러 레이어
│       │   ├── service/           # 비즈니스 로직
│       │   ├── repository/        # 데이터 액세스
│       │   └── model/             # 도메인 모델
│       ├── foundation/            # 기반 설정
│       ├── platform/              # 플랫폼 레이어
│       └── main.py                # FastAPI 애플리케이션
│
├── 🌡️ climate-service/            # 기후리스크 분석 서비스 (포트: 8087)
│   └── app/
│       ├── api/                   # API 엔드포인트
│       ├── domain/                # 기후리스크 도메인 로직
│       ├── infrastructure/        # 외부 서비스 연동
│       └── main.py                # FastAPI 애플리케이션
│
├── 📋 disclosure-service/         # 지속가능성 공시 데이터 관리 (포트: 8083)
│   └── app/
│       ├── api/                   # 공시 API 엔드포인트
│       │   └── disclosure_router.py # 공시 라우터 (/health 포함)
│       ├── domain/                # 공시 도메인 로직
│       │   ├── controller/        # 컨트롤러 레이어
│       │   │   └── disclosure_controller.py
│       │   ├── service/           # 비즈니스 로직
│       │   │   └── disclosure_service.py
│       │   ├── repository/        # 데이터 액세스
│       │   │   └── disclosure_repository.py
│       │   └── model/             # 도메인 모델
│       │       ├── disclosure_entity.py
│       │       └── disclosure_schema.py
│       ├── foundation/            # 기반 설정
│       ├── platform/              # 플랫폼 레이어
│       └── main.py                # FastAPI 애플리케이션
│
├── 🚪 auth-service/               # 사용자 인증 및 계정 관리 (포트: 8084)
│   └── app/
│       ├── api/                   # 인증 API 엔드포인트
│       ├── domain/                # 인증 도메인 로직
│       │   ├── controller/        # 컨트롤러 레이어
│       │   ├── service/           # 비즈니스 로직
│       │   ├── repository/        # 데이터 액세스
│       │   └── model/             # 도메인 모델
│       ├── foundation/            # 기반 설정
│       ├── platform/              # 플랫폼 레이어
│       └── main.py                # FastAPI 애플리케이션
│
├── 🔄 n8n-service/                # 워크플로우 자동화 (포트: 5678)
│   ├── workflows/                 # n8n 워크플로우 정의
│   └── Dockerfile                 # 커스텀 n8n 이미지
│
├── ☸️ k8s/                        # Kubernetes 배포 설정
│   ├── *.yaml                     # 서비스별 K8s 매니페스트
│   ├── deploy.sh                  # 배포 스크립트
│   └── build-images.sh            # 이미지 빌드 스크립트
│
├── 🗄️ sql/                       # 데이터베이스 스키마 관리
│   └── schema/                    # 데이터베이스 스키마 파일들
│       └── create_all_tables.sql  # 전체 테이블 생성 스크립트
│
├── 🐳 docker-compose.yml          # Docker Compose 설정
├── 📋 Makefile                    # 빌드 및 배포 명령어
└── 📚 README.md                   # 프로젝트 문서
```

## 🛠️ 기술 스택

### Frontend (Next.js 15)
```typescript
// 핵심 기술
- Next.js 15 (App Router, Server Components)
- TypeScript 5.8+
- React 19
- Tailwind CSS 3.4

// 상태 관리 & 데이터 페칭
- Zustand (경량 상태 관리)
- React Query/SWR (서버 상태 관리)

// UI 컴포넌트
- Radix UI (헤드리스 컴포넌트)
- Framer Motion (애니메이션)
- Lucide React (아이콘)

// 지도 & 시각화
- Leaflet + React-Leaflet (지도)
- Recharts (차트)

// 개발 도구
- ESLint + Prettier
- Husky (Git Hooks)
```

### Backend (Python FastAPI)
```python
# 핵심 프레임워크
- FastAPI 0.104+ (비동기 웹 프레임워크)
- Pydantic 2.0+ (데이터 검증)
- SQLAlchemy 2.0+ (ORM)
- Alembic (데이터베이스 마이그레이션)

# 데이터베이스
- PostgreSQL 15 (메인 데이터베이스)
- Redis (캐싱 & 세션)

# 인증 & 보안
- JWT (JSON Web Tokens)
- OAuth 2.0 / OpenID Connect
- CORS 미들웨어

# 모니터링 & 로깅
- Prometheus (메트릭)
- Grafana (대시보드)
- Structured Logging
```

### DevOps & Infrastructure
```yaml
# 컨테이너화
- Docker & Docker Compose
- Multi-stage Dockerfile

# 오케스트레이션
- Kubernetes (K8s)
- k3d (로컬 K8s 클러스터)

# CI/CD
- GitHub Actions
- Automated Testing
- Container Registry

# 모니터링
- Prometheus + Grafana
- Jaeger (분산 추적)
- ELK Stack (로깅)
```

## 🚀 서비스별 상세 정보

### 🚪 Gateway Service (포트: 8080)
**역할**: API Gateway 패턴을 구현한 중앙 집중식 라우팅 서비스

**주요 기능**:
- 서비스 디스커버리 및 로드 밸런싱
- 인증 및 권한 부여
- 요청/응답 로깅 및 모니터링
- Rate Limiting 및 Circuit Breaker

**DDD 구조**:
```python
gateway-service/app/
├── domain/
│   └── model/
│       ├── service_type.py      # 서비스 타입 열거형
│       └── service_factory.py   # 서비스 프록시 팩토리
├── api/                         # API 라우터
├── middleware/                  # 미들웨어 (CORS, 로깅 등)
└── main.py                      # FastAPI 애플리케이션
```

### 🤖 Chatbot Service (포트: 8081)
**역할**: KoBERT 기반 한국어 자연어 처리 챗봇

**주요 기능**:
- 자연어 이해 (NLU)
- 의도 분류 및 개체명 인식
- 컨텍스트 기반 대화 관리
- 기후리스크 관련 질의응답

### 💰 Finance Impact Service (포트: 8082)
**역할**: 폭염으로 인한 잠재적 재무영향 산출 서비스

**주요 기능**:
- 산업 유형별(제조업, 건설업, 반도체 등) 폭염 재무영향 계산
- climate-service와의 데이터 연동을 통한 지역별 폭염일수 활용
- TCFD 관련 데이터 기반 재무영향 모델링
- 기업별 맞춤형 리스크 평가 및 보고서 생성

**DDD 구조**:
```python
finimpact-service/app/
├── domain/
│   ├── controller/              # 요청 처리 및 응답 관리
│   ├── service/                 # 비즈니스 로직 구현
│   ├── repository/              # 데이터 액세스 레이어
│   └── model/                   # 도메인 엔티티 및 스키마
├── foundation/                  # 기반 설정 (DB, 로깅 등)
└── platform/                   # 플랫폼 레이어 (외부 연동)
```

### 🌡️ Climate Service (포트: 8087)
**역할**: 기후리스크 분석 및 평가 핵심 서비스

**주요 기능**:
- 기후 데이터 수집 및 분석
- 리스크 모델링 및 시뮬레이션
- 지역별 기후리스크 평가
- 시각화 데이터 제공

### 📋 Disclosure Service (포트: 8083)
**역할**: IFRS S2 지표 및 지속가능성 공시 마스터 데이터 관리 서비스

**주요 기능**:
- IFRS S2 지표 및 요구사항 등 지속가능성 공시 마스터 데이터 제공
- 관련 개념 및 국가별 도입 현황 정보 관리
- 지속가능성 공시 관련 용어 정의 및 검색
- IFRS S2 지표 선택 화면 구현의 백엔드 역할

**DDD 구조**:
```python
disclosure-service/app/
├── domain/
│   ├── controller/              # 공시 요청 처리 및 응답 관리
│   ├── service/                 # 공시 비즈니스 로직 구현
│   ├── repository/              # 공시 데이터 액세스 레이어
│   └── model/                   # 공시 엔티티 및 스키마
├── foundation/                  # 기반 설정 (DB, 로깅 등)
└── platform/                   # 플랫폼 레이어 (외부 연동)
```

### 🚪 Auth Service (포트: 8084)
**역할**: 사용자 인증 및 계정 관리 서비스

**주요 기능**:
- 사용자 인증 (Google OAuth 연동)
- 회원가입 및 로그인 처리
- JWT 토큰 발급 및 관리
- 사용자 세션 관리

**DDD 구조**:
```python
auth-service/app/
├── domain/
│   ├── controller/              # 인증 요청 처리 및 응답 관리
│   ├── service/                 # 인증 비즈니스 로직 구현
│   ├── repository/              # 사용자 데이터 액세스 레이어
│   └── model/                   # 사용자 엔티티 및 스키마
├── foundation/                  # 기반 설정 (DB, JWT 등)
└── platform/                   # 플랫폼 레이어 (OAuth 연동)
```

### 🔄 N8N Service (포트: 5678)
**역할**: 워크플로우 자동화 및 데이터 파이프라인

**주요 기능**:
- 데이터 수집 자동화
- 외부 API 연동
- 알림 및 리포팅 자동화
- 배치 작업 스케줄링

## 🎨 Frontend 설계 원칙

### DDD 기반 도메인 구조
```typescript
// 도메인별 독립적인 구조
src/domain/climate-risk/
├── components/           # 도메인 특화 컴포넌트
│   ├── ClimateRiskPage.tsx
│   ├── ClimateRiskMaps.tsx
│   └── ClimateRiskTable.tsx
├── hooks/               # 도메인 특화 훅
│   └── useClimateData.ts
├── services/            # API 서비스 레이어
│   └── climateApi.ts
├── store/               # 도메인 상태 관리
│   └── climateStore.ts
├── types.ts             # 타입 정의
└── constants.ts         # 도메인 상수
```

### 확장 가능한 컴포넌트 설계
```typescript
// 재사용 가능한 공통 컴포넌트
src/shared/components/
├── ui/                  # 기본 UI 컴포넌트
│   ├── Button/
│   ├── Input/
│   └── Modal/
├── layout/              # 레이아웃 컴포넌트
│   ├── Header/
│   └── Sidebar/
└── charts/              # 차트 컴포넌트
    ├── LineChart/
    └── BarChart/
```

## 🐳 배포 방식

### Docker Compose (개발/테스트 환경)
```bash
# 전체 서비스 실행
make up

# 특정 서비스만 실행
make up-chatbot
make up-finimpact
make up-disclosure
make up-climate
make up-auth

# 로그 확인
make logs
make logs-gateway

# 서비스 중지
make down
```

### Kubernetes (프로덕션 환경)
```bash
# 로컬 K8s 클러스터 생성 (k3d)
k3d cluster create sky-c

# 이미지 빌드 및 클러스터에 로드
cd k8s && ./build-images.sh

# 서비스 배포
./deploy.sh

# 상태 확인
kubectl get pods
kubectl get services
```

## 🔧 개발 환경 설정

### 필수 요구사항
- **Node.js** 18+ (Frontend)
- **Python** 3.11+ (Backend)
- **Docker** & **Docker Compose**
- **kubectl** & **k3d** (Kubernetes)
- **Make** (빌드 도구)

### 로컬 개발 환경 구축

1. **저장소 클론**
```bash
git clone <repository-url>
cd sky-c
```

2. **환경 변수 설정**
```bash
# 각 서비스별 .env 파일 생성
cp gateway-service/.env.example gateway-service/.env
cp chatbot-service/.env.example chatbot-service/.env
cp climate-service/.env.example climate-service/.env
```

3. **의존성 설치 및 실행**
```bash
# Docker Compose로 전체 서비스 실행
make up

# 또는 개별 서비스 실행
make up-frontend
make up-gateway
make up-chatbot
```

## 🗄️ 데이터베이스 스키마 관리

### 자동 스키마 초기화
프로젝트는 PostgreSQL 컨테이너 시작 시 자동으로 데이터베이스 스키마를 생성합니다.

```bash
# PostgreSQL 컨테이너 시작 (스키마 자동 생성)
make up

# 또는 PostgreSQL만 시작
docker-compose up -d postgres
```

### 스키마 구조
`sql/schema/create_all_tables.sql`에 정의된 8개 테이블:

1. **user** - 사용자 정보 (Google OAuth 연동)
2. **issb_s2_disclosure** - ISSB S2 지표 정보
3. **issb_s2_requirement** - S2 지표별 요구사항
4. **answer** - 사용자별 요구사항 응답 데이터
5. **issb_s2_term** - S2 용어 정의
6. **climate_disclosure_concept** - 기후공시 개념
7. **issb_adoption_status** - 국가별 ISSB 도입 현황
8. **heatwave_summary** - 폭염일수 요약 데이터

### 스키마 수정 방법
1. `sql/schema/create_all_tables.sql` 파일 수정
2. PostgreSQL 컨테이너 재시작으로 변경사항 적용:
```bash
docker-compose down postgres
docker volume rm aws-develope_pgdata  # 기존 데이터 삭제
docker-compose up -d postgres          # 새 스키마로 재생성
```

## 📊 API 문서

각 서비스의 OpenAPI 문서는 다음 URL에서 확인할 수 있습니다:

- **Gateway**: http://localhost:8080/docs
- **Chatbot**: http://localhost:8081/docs
- **Finance Impact**: http://localhost:8082/docs
- **Disclosure**: http://localhost:8083/docs
- **Auth**: http://localhost:8084/docs
- **Climate**: http://localhost:8087/docs
- **Frontend**: http://localhost:3000

## 🔍 모니터링 & 로깅

### 애플리케이션 모니터링
- **Prometheus**: 메트릭 수집
- **Grafana**: 대시보드 및 알림
- **Jaeger**: 분산 추적

### 로깅 전략
```python
# 구조화된 로깅
import structlog

logger = structlog.get_logger()
logger.info(
    "API request processed",
    service="gateway",
    endpoint="/api/climate/risk",
    duration_ms=150,
    status_code=200
)
```

## 🧪 테스트 전략

### Frontend 테스트
```typescript
// Jest + Testing Library
- 단위 테스트: 컴포넌트 로직
- 통합 테스트: API 연동
- E2E 테스트: Playwright
```

### Backend 테스트
```python
# pytest + FastAPI TestClient
- 단위 테스트: 비즈니스 로직
- 통합 테스트: API 엔드포인트
- 계약 테스트: 서비스 간 통신
```

## 🚀 배포 전략

### 개발 환경
```bash
# Docker Compose 기반 로컬 개발
make up
```

### 스테이징 환경
```bash
# Kubernetes 기반 스테이징
kubectl apply -f k8s/staging/
```

### 프로덕션 환경
```bash
# Blue-Green 배포
kubectl apply -f k8s/production/
```

## 🤝 기여 가이드

### 개발 워크플로우
1. **Feature Branch 생성**
```bash
git checkout -b feature/climate-risk-enhancement
```

2. **개발 및 테스트**
```bash
# 로컬 테스트
make test

# 코드 품질 검사
make lint
```

3. **Pull Request 생성**
- 코드 리뷰 필수
- 테스트 커버리지 80% 이상
- 문서 업데이트 포함

### 코딩 컨벤션
- **Frontend**: ESLint + Prettier
- **Backend**: Black + isort + flake8
- **Commit**: Conventional Commits

## 📈 성능 최적화

### Frontend 최적화
- **Next.js App Router**: 서버 컴포넌트 활용
- **Code Splitting**: 동적 임포트
- **Image Optimization**: Next.js Image 컴포넌트
- **Caching**: SWR/React Query

### Backend 최적화
- **비동기 처리**: FastAPI + asyncio
- **데이터베이스**: 연결 풀링, 인덱싱
- **캐싱**: Redis 활용
- **로드 밸런싱**: Gateway 레벨

## 🔒 보안 고려사항

- **인증**: JWT + OAuth 2.0
- **권한 부여**: RBAC (Role-Based Access Control)
- **데이터 암호화**: TLS 1.3, 데이터베이스 암호화
- **보안 헤더**: CORS, CSP, HSTS
- **취약점 스캔**: 정기적인 보안 감사

## 📞 지원 및 문의

- **이슈 트래킹**: GitHub Issues
- **문서**: 프로젝트 Wiki
- **커뮤니티**: Discussions

---

**Sky-C**는 현대적인 클라우드 네이티브 아키텍처와 DDD 원칙을 적용하여 확장 가능하고 유지보수가 용이한 기후리스크 평가 시스템을 제공합니다. 🌍 