# Sky-C: ISSB S2 기후공시 자동화 플랫폼

> **IFRS S2 기후공시 규제 대응을 위한 AI 기반 자동화 시스템**  
> Domain-Driven Design (DDD) 원칙과 Microservices Architecture (MSA) 패턴을 적용한 확장 가능한 클라우드 네이티브 애플리케이션

## 🌟 프로젝트 개요

Sky-C는 **IFRS S2 기후공시 규제**에 대응하기 위한 종합적인 자동화 플랫폼입니다. 기업들이 복잡한 기후공시 요구사항을 쉽고 빠르게 준비할 수 있도록 AI 기반 자동화 솔루션을 제공합니다.

### 🎯 핵심 가치 제안

- **🤖 AI 기반 자동화**: 사용자 입력 데이터를 바탕으로 TCFD 보고서 자동 생성
- **📊 체계적인 지표 관리**: IFRS S2 요구사항에 따른 구조화된 데이터 입력 시스템
- **🌍 실시간 기후리스크 분석**: 지역별 기후변화 시나리오 기반 리스크 평가
- **💰 재무영향 모델링**: 기후리스크의 잠재적 재무영향 자동 계산
- **📋 규제 준수**: ISSB, TCFD 프레임워크 완벽 준수

## 🏗️ 시스템 아키텍처

Sky-C는 **모노레포(Monorepo)** 방식으로 구성된 마이크로서비스 아키텍처를 채택하여, 각 도메인별로 독립적인 서비스를 제공하면서도 통합된 사용자 경험을 제공합니다.

### 📁 프로젝트 구조

```
sky-c/
├── 🎨 frontend/                    # Next.js 15 + TypeScript (포트: 3000)
│   ├── src/
│   │   ├── app/                   # App Router 기반 페이지
│   │   │   ├── auth/              # 인증 (Google OAuth)
│   │   │   ├── dashboard/         # 메인 대시보드
│   │   │   │   ├── home/          # 대시보드 홈
│   │   │   │   └── indicators/    # ISSB S2 지표 입력 시스템
│   │   │   ├── service/           # 핵심 서비스
│   │   │   │   ├── climate-risk/  # 기후리스크 평가
│   │   │   │   ├── financial-impact/ # 재무영향 분석
│   │   │   │   └── tcfd-report/   # TCFD 보고서 생성
│   │   │   ├── basic/             # 기본 정보
│   │   │   │   ├── concepts/      # 기후공시 개념
│   │   │   │   └── adoption-status/ # ISSB 도입 현황
│   │   │   ├── report/            # 보고서 관리
│   │   │   ├── my-page/           # 마이페이지
│   │   │   └── about/             # 프로젝트 소개
│   │   ├── domain/                # 도메인별 비즈니스 로직
│   │   └── shared/                # 공유 컴포넌트 및 유틸리티
│   └── public/                    # 정적 자산 (이미지, 지도 데이터 등)
│
├── 🚪 gateway-service/             # API Gateway (포트: 8080)
│   └── app/
│       ├── api/                   # 라우팅 및 프록시
│       ├── domain/                # 서비스 팩토리 및 타입 정의
│       ├── foundation/            # JWT 인증 미들웨어
│       └── main.py                # FastAPI 애플리케이션
│
├── 🔐 auth-service/               # 인증 서비스 (포트: 8084)
│   └── app/
│       ├── api/                   # Google OAuth 콜백 처리
│       ├── domain/                # 사용자 관리 도메인 로직
│       │   ├── controller/        # 인증 컨트롤러
│       │   ├── service/           # 인증 비즈니스 로직
│       │   ├── repository/        # 사용자 데이터 액세스
│       │   └── model/             # 사용자 엔티티 및 스키마
│       ├── foundation/            # JWT 유틸리티, 데이터베이스
│       └── main.py
│
├── 📋 disclosure-service/         # 공시 데이터 관리 (포트: 8083)
│   └── app/
│       ├── api/                   # ISSB S2 지표 API
│       ├── domain/                # 공시 도메인 로직
│       │   ├── controller/        # 공시 컨트롤러
│       │   ├── service/           # 공시 비즈니스 로직
│       │   ├── repository/        # 공시 데이터 액세스
│       │   └── model/             # 공시 엔티티 및 스키마
│       ├── foundation/            # 데이터베이스, 초기 데이터 로더
│       ├── data/                  # ISSB S2 마스터 데이터 (CSV)
│       └── main.py
│
├── 🌡️ climate-service/            # 기후리스크 분석 (포트: 8087)
│   └── app/
│       ├── api/                   # 기후 데이터 API
│       ├── domain/                # 기후리스크 도메인 로직
│       │   ├── controller/        # 기후 컨트롤러
│       │   ├── service/           # 기후 분석 비즈니스 로직
│       │   ├── repository/        # 기후 데이터 액세스
│       │   └── model/             # 기후 엔티티 및 스키마
│       ├── foundation/            # 데이터베이스, 폭염 데이터 전처리
│       │   └── schema/            # 폭염 테이블 생성 스크립트
│       └── main.py
│
├── 💰 finimpact-service/          # 재무영향 분석 (포트: 8082)
│   └── app/
│       ├── api/                   # 재무영향 분석 API
│       ├── domain/                # 재무영향 도메인 로직
│       │   ├── controller/        # 재무영향 컨트롤러
│       │   ├── service/           # 재무영향 계산 비즈니스 로직
│       │   ├── repository/        # 재무 데이터 액세스
│       │   └── model/             # 재무영향 엔티티 및 스키마
│       └── main.py
│
├── 🤖 chatbot-service/            # AI 챗봇 (포트: 8081)
│   └── app/
│       ├── api/                   # 챗봇 API
│       ├── domain/                # 채팅 도메인 로직
│       │   ├── controller/        # 채팅 컨트롤러
│       │   ├── service/           # 채팅 비즈니스 로직
│       │   └── model/             # 채팅 스키마
│       └── main.py
│
├── 🎓 training-service/           # AI 모델 훈련 서비스
│   ├── app/
│   │   ├── configs/               # 모델 및 훈련 설정
│   │   ├── data_preprocessing.py  # 데이터 전처리
│   │   ├── train_model.py         # 모델 훈련
│   │   ├── test_model.py          # 모델 테스트
│   │   └── generate_initial_model.py # 초기 모델 생성
│   ├── models/                    # 훈련된 모델 저장소
│   ├── data/                      # 훈련 데이터
│   ├── outputs/                   # 훈련 결과물
│   ├── logs/                      # 훈련 로그
│   └── checkpoints/               # 모델 체크포인트
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
├── 🗄️ sql/                       # 데이터베이스 스키마
│   └── schema/
│       └── create_all_tables.sql  # 전체 테이블 생성 스크립트
│
├── 🐳 docker-compose.yml          # Docker Compose 설정
├── 📋 Makefile                    # 빌드 및 배포 명령어
└── 📚 README.md                   # 프로젝트 문서
```

## 🛠️ 기술 스택

### 🎨 Frontend (Next.js 15)
```typescript
// 핵심 프레임워크
- Next.js 15 (App Router, Server Components)
- TypeScript 5.8+
- React 19
- Tailwind CSS 3.4

// 상태 관리 & API
- Zustand (상태 관리 + 로컬 저장소 지속성)
- Axios (HTTP 클라이언트)
- JWT Decode (토큰 처리)

// UI 컴포넌트 & 애니메이션
- Radix UI (헤드리스 UI 컴포넌트)
- Lucide React (아이콘)
- React Icons (추가 아이콘)
- Framer Motion (애니메이션)
- AOS (스크롤 애니메이션)

// 지도 & 시각화
- Leaflet + React-Leaflet (인터랙티브 지도)
- Recharts (차트 및 그래프)
- Lottie React (애니메이션)

// PWA & 최적화
- Next PWA (Progressive Web App)
- Sharp (이미지 최적화)
- Next Themes (다크/라이트 모드)
```

### 🔧 Backend (Python FastAPI)
```python
# 핵심 프레임워크
- FastAPI 0.104+ (비동기 웹 프레임워크)
- Pydantic 2.0+ (데이터 검증 및 직렬화)
- SQLAlchemy 2.0+ (ORM)
- Uvicorn (ASGI 서버)

# 데이터베이스
- PostgreSQL 15 (메인 데이터베이스)
- psycopg2 (PostgreSQL 어댑터)

# 인증 & 보안
- JWT (JSON Web Tokens)
- Google OAuth 2.0
- CORS 미들웨어
- Passlib (비밀번호 해싱)

# HTTP & 외부 연동
- HTTPX (비동기 HTTP 클라이언트)
- Python-dotenv (환경 변수 관리)
```

### 🤖 AI & ML (Training Service)
```python
# AI 모델 & 훈련
- Transformers (Hugging Face)
- PyTorch (딥러닝 프레임워크)
- LoRA (Low-Rank Adaptation)
- Tokenizers (토크나이저)

# 데이터 처리
- Pandas (데이터 분석)
- NumPy (수치 계산)
- Datasets (데이터셋 관리)

# GPU 지원
- CUDA (GPU 가속)
- NVIDIA Container Toolkit
```

### 🐳 DevOps & Infrastructure
```yaml
# 컨테이너화
- Docker & Docker Compose
- Multi-stage Dockerfile
- NVIDIA GPU 지원

# 오케스트레이션
- Kubernetes (K8s)
- 커스텀 매니페스트

# 워크플로우 자동화
- n8n (시각적 워크플로우 편집기)
- 커스텀 워크플로우 템플릿

# 빌드 도구
- Makefile (통합 명령어 관리)
- 자동화된 빌드 스크립트
```

## 🌟 핵심 기능

### 1. 🔐 통합 인증 시스템
- **Google OAuth 2.0**: 간편한 소셜 로그인
- **JWT 기반 인증**: 안전한 토큰 기반 세션 관리
- **자동 회원가입**: OAuth 연동 시 자동 사용자 생성
- **세션 지속성**: 리프레시 토큰을 통한 자동 로그인 유지

### 2. 📊 ISSB S2 지표 입력 시스템
- **체계적인 지표 관리**: IFRS S2 요구사항 기반 구조화된 입력 폼
- **다양한 입력 타입 지원**:
  - 텍스트 입력 (단문/장문)
  - 숫자 입력 (통화, 백분율 등)
  - 테이블 입력 (동적 행 생성)
  - 구조화된 리스트
  - 온실가스 배출량 계산기 (Scope 1, 2, 3)
  - 선택형 입력 (드롭다운, 체크박스)
- **실시간 데이터 저장**: Zustand 기반 상태 관리로 입력 중 자동 저장
- **진행률 추적**: 카테고리별 완료 상태 시각적 모니터링
- **데이터 유효성 검증**: 실시간 입력 값 검증 및 오류 표시

### 3. 🌍 지역별 기후리스크 평가
- **인터랙티브 지도**: Leaflet 기반 한국 지역별 리스크 시각화
- **다중 시나리오 분석**: SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5
- **시계열 데이터 분석**: 2025~2050년 기후변화 예측 데이터
- **리스크 유형별 분석**:
  - 폭염일수 증가
  - 수자원 부족 리스크
  - 태풍 강도 변화
  - 해수면 상승 영향
- **지역별 맞춤 분석**: 시도별, 시군구별 세부 리스크 평가

### 4. 💰 재무영향 분석 엔진
- **업종별 맞춤 모델링**: 제조업, 건설업, 반도체 등 산업별 특화 분석
- **리스크 기반 재무 계산**: 기후 리스크의 정량적 재무영향 산출
- **시나리오별 손실 추정**: 다양한 기후 시나리오에 따른 잠재 손실 계산
- **TCFD 연계 분석**: 물리적 리스크와 전환 리스크 통합 평가

### 5. 🤖 AI 기반 TCFD 보고서 자동 생성
- **지능형 문서 생성**: 사용자 입력 데이터 기반 자동 보고서 작성
- **TCFD 프레임워크 준수**: 4대 영역 완벽 구현
  - 지배구조 (Governance)
  - 전략 (Strategy)
  - 위험관리 (Risk Management)
  - 지표 및 목표 (Metrics and Targets)
- **커스텀 AI 모델**: LLaMA 3 기반 한국어 특화 모델
- **PDF 내보내기**: 완성된 보고서 다운로드 및 공유

### 6. 📚 기후공시 지식 베이스
- **ISSB 도입 현황**: 전 세계 국가별 도입 상태 실시간 업데이트
- **기후공시 개념사전**: 핵심 용어 및 개념 체계적 정리
- **세계 지도 시각화**: 국가별 도입 현황 인터랙티브 맵
- **규제 동향 분석**: 최신 규제 변화 및 영향 분석

### 7. 🎯 통합 대시보드 & 관리
- **진행 상황 대시보드**: 전체 공시 준비 진행률 한눈에 보기
- **마이페이지**: 사용자 정보 및 기업 정보 관리
- **보고서 히스토리**: 생성된 보고서 목록 및 버전 관리
- **알림 시스템**: 마감일 알림 및 중요 업데이트 알림

### 8. 🔄 워크플로우 자동화 (n8n)
- **데이터 수집 자동화**: 외부 기후 데이터 소스 연동
- **알림 자동화**: Slack, 이메일 등 다채널 알림
- **보고서 배포 자동화**: 완성된 보고서 자동 전송
- **정기 업데이트**: 스케줄링된 데이터 업데이트

## 🎨 사용자 경험 (UX) 특징

### 🎯 직관적인 인터페이스
- **단계별 가이드**: 복잡한 공시 과정을 단계별로 안내
- **실시간 도움말**: 각 입력 필드별 상세 가이드 제공
- **진행률 표시**: 현재 진행 상황과 남은 작업 시각적 표시

### 📱 반응형 디자인
- **모든 디바이스 지원**: 데스크톱, 태블릿, 모바일 완벽 지원
- **PWA 기능**: 모바일 앱처럼 설치 및 오프라인 사용 가능
- **다크/라이트 모드**: 사용자 선호에 따른 테마 자동 전환

### ⚡ 성능 최적화
- **서버 컴포넌트**: Next.js 15 App Router 활용한 렌더링 최적화
- **이미지 최적화**: Sharp를 통한 자동 압축 및 WebP 변환
- **코드 분할**: 라우트별 동적 임포트
- **캐싱 전략**: 효율적인 데이터 캐싱으로 빠른 응답 속도

## 🗄️ 데이터베이스 설계

### 📊 핵심 테이블 구조
```sql
-- 사용자 관리
member                     -- 사용자 정보 (Google OAuth 연동)

-- ISSB S2 공시 데이터
issb_s2_disclosure        -- ISSB S2 공시 지표 정보
issb_s2_requirement       -- 지표별 세부 요구사항
answer                    -- 사용자별 지표 응답 데이터

-- 기후공시 지식 베이스
issb_s2_term             -- S2 용어 정의
climate_disclosure_concept -- 기후공시 개념
issb_adoption_status     -- 국가별 ISSB 도입 현황

-- 기후 데이터
heatwave_summary         -- 폭염일수 요약 데이터 (지역별, 시나리오별)
```

### 🔄 자동 스키마 관리
- **컨테이너 시작 시 자동 초기화**: PostgreSQL 컨테이너 실행 시 스키마 자동 생성
- **마스터 데이터 자동 로드**: disclosure-service에서 CSV 파일 기반 초기 데이터 로드
- **데이터 무결성**: 외래키 제약조건 및 데이터 검증 규칙 적용

## 🚀 빠른 시작

### 🔧 필수 요구사항
- **Docker** & **Docker Compose** 20.10+
- **Node.js** 18+ (프론트엔드 개발 시)
- **Python** 3.11+ (백엔드 개발 시)
- **Make** (통합 명령어 실행)
- **NVIDIA GPU** (AI 모델 훈련 시, 선택사항)

### ⚡ 전체 시스템 실행

1. **저장소 클론**
```bash
git clone https://github.com/junyeongccom/SKY-C_v0.01.git
cd SKY-C_v0.01
```

2. **환경 변수 설정**
```bash
# 각 서비스별 환경 변수 파일 생성 (예시)
cp auth-service/.env.example auth-service/.env
cp disclosure-service/.env.example disclosure-service/.env
# ... 기타 서비스들
```

3. **전체 시스템 실행**
```bash
# 모든 서비스 빌드 및 실행
make up

# 실행 상태 확인
make ps

# 로그 확인
make logs
```

4. **서비스 접속**
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **n8n 워크플로우**: http://localhost:5678

### 🔧 개별 서비스 관리

```bash
# 개별 서비스 실행
make up-frontend
make up-gateway
make up-auth
make up-disclosure
make up-climate
make up-finimpact
make up-chatbot
make up-n8n
make up-training

# 개별 서비스 로그 확인
make logs-frontend
make logs-gateway
# ... 기타 서비스들

# 개별 서비스 재시작
make restart-frontend
make restart-gateway
# ... 기타 서비스들
```

### 🤖 AI 모델 관리

```bash
# 초기 모델 설정 (LLaMA 3 다운로드 + LoRA 어댑터 생성)
make setup-model

# 모델 훈련 실행
make train-model

# 모델 채팅 테스트
make test-chat

# 모델 파일 확인
make check-models

# 훈련 서비스 컨테이너 접속
make shell-training
```

## 📊 API 문서

각 마이크로서비스는 FastAPI의 자동 생성 OpenAPI 문서를 제공합니다:

| 서비스 | URL | 설명 |
|--------|-----|------|
| **Gateway** | http://localhost:8080/docs | API Gateway 라우팅 정보 |
| **Auth** | http://localhost:8084/docs | 인증 및 사용자 관리 API |
| **Disclosure** | http://localhost:8083/docs | ISSB S2 지표 및 공시 데이터 API |
| **Climate** | http://localhost:8087/docs | 기후리스크 분석 API |
| **FinImpact** | http://localhost:8082/docs | 재무영향 분석 API |
| **Chatbot** | http://localhost:8081/docs | AI 챗봇 API |

## ☸️ Kubernetes 배포

### 🔧 로컬 K8s 클러스터 설정

```bash
# k3d 클러스터 생성
k3d cluster create sky-c

# 이미지 빌드 및 클러스터에 로드
cd k8s
./build-images.sh

# 서비스 배포
./deploy.sh

# 배포 상태 확인
kubectl get pods
kubectl get services
kubectl get ingress
```

### 📋 K8s 매니페스트

```
k8s/
├── postgres.yaml          # PostgreSQL 데이터베이스
├── frontend.yaml          # Next.js 프론트엔드
├── gateway.yaml           # API Gateway
├── auth.yaml              # 인증 서비스  
├── disclosure.yaml        # 공시 데이터 서비스
├── climate.yaml           # 기후 분석 서비스
├── finimpact.yaml         # 재무영향 서비스
├── chatbot.yaml           # AI 챗봇 서비스
├── n8n.yaml               # 워크플로우 자동화
├── ingress.yaml           # Ingress 설정
└── n8n-secrets.yaml       # n8n 시크릿 설정
```

## 🔒 보안 고려사항

### 🛡️ 인증 및 권한 부여
- **OAuth 2.0**: Google OAuth를 통한 안전한 인증
- **JWT 토큰**: 무상태 인증으로 확장성 확보
- **토큰 만료 관리**: 적절한 토큰 수명 관리
- **CORS 정책**: 출처 기반 요청 제한

### 🔐 데이터 보안
- **데이터베이스 암호화**: 민감 데이터 암호화 저장
- **환경 변수 관리**: 시크릿 정보 환경 변수 분리
- **HTTPS 적용**: 모든 통신 TLS 암호화
- **입력 데이터 검증**: Pydantic을 통한 엄격한 데이터 검증

### 🚨 보안 모니터링
- **액세스 로그**: 모든 API 요청 로깅
- **에러 처리**: 민감 정보 노출 방지
- **Rate Limiting**: API 남용 방지 (향후 구현 예정)

## 📈 성능 최적화

### 🎯 Frontend 최적화
- **Next.js 15 App Router**: 서버 컴포넌트 활용한 렌더링 최적화
- **이미지 최적화**: Sharp를 통한 자동 압축 및 WebP 변환
- **코드 분할**: 라우트별 동적 임포트
- **상태 관리**: Zustand의 경량 상태 관리로 성능 향상
- **PWA 캐싱**: 서비스 워커를 통한 효율적인 캐싱

### ⚡ Backend 최적화
- **비동기 처리**: FastAPI + asyncio를 통한 높은 동시성
- **데이터베이스 최적화**: 
  - 연결 풀링으로 효율적인 DB 연결 관리
  - 적절한 인덱싱으로 쿼리 성능 향상
- **API Gateway**: 중앙집중식 라우팅으로 효율적인 요청 처리
- **마이크로서비스**: 서비스별 독립적인 확장 가능

### 🤖 AI 모델 최적화
- **LoRA 어댑터**: 전체 모델 재훈련 없이 효율적인 파인튜닝
- **GPU 활용**: CUDA 기반 모델 추론 가속화
- **모델 압축**: 양자화 및 프루닝을 통한 모델 경량화 (향후 구현)

## 🧪 테스트 전략

### 🎯 Frontend 테스트
```typescript
// 테스트 도구
- Jest (단위 테스트)
- React Testing Library (컴포넌트 테스트)
- Playwright (E2E 테스트) - 향후 구현

// 테스트 범위
- 컴포넌트 렌더링 테스트
- 사용자 인터랙션 테스트
- API 연동 테스트
```

### 🔧 Backend 테스트
```python
# 테스트 도구
- pytest (테스트 프레임워크)
- FastAPI TestClient (API 테스트)
- pytest-asyncio (비동기 테스트)

# 테스트 범위
- 단위 테스트: 비즈니스 로직
- 통합 테스트: API 엔드포인트
- 데이터베이스 테스트: 리포지토리 레이어
```

## 🤝 기여 가이드

### 📋 개발 워크플로우

1. **Feature Branch 생성**
```bash
git checkout -b feature/새로운-기능명
```

2. **개발 및 테스트**
```bash
# 로컬 테스트 실행
make test  # 향후 구현

# 코드 품질 검사
make lint  # 향후 구현
```

3. **Pull Request 생성**
- 명확한 PR 제목과 설명
- 테스트 커버리지 유지
- 코드 리뷰 필수

### 📝 코딩 컨벤션

#### Frontend (TypeScript)
- **ESLint + Prettier**: 자동 코드 포맷팅
- **TypeScript Strict Mode**: 타입 안정성 확보
- **컴포넌트 네이밍**: PascalCase
- **파일 구조**: 도메인별 분리

#### Backend (Python)
- **Black**: 코드 포맷팅
- **isort**: import 정렬
- **flake8**: 린팅
- **Type Hints**: 모든 함수에 타입 힌트 적용

#### Commit Convention
- **Conventional Commits**: 표준화된 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 과정 또는 보조 도구 변경
```

## 🚀 로드맵

### 🎯 Phase 1: 핵심 기능 완성 (현재)
- ✅ 기본 인증 시스템
- ✅ ISSB S2 지표 입력 시스템
- ✅ 기후리스크 평가 기능
- ✅ 재무영향 분석 엔진
- ✅ 기본 대시보드

### 🚀 Phase 2: AI 고도화 (진행 중)
- 🔄 LLaMA 3 기반 한국어 모델 파인튜닝
- 🔄 TCFD 보고서 자동 생성 AI
- 📋 자연어 질의응답 챗봇 고도화
- 📋 이미지 생성 AI 연동 (차트, 그래프)

### 🌟 Phase 3: 고급 기능 (계획)
- 📋 실시간 협업 기능
- 📋 다국어 지원 (영어, 일본어)
- 📋 모바일 앱 개발
- 📋 Enterprise 기능 (멀티 테넌트)

### 🔧 Phase 4: 플랫폼 확장 (계획)
- 📋 API 마켓플레이스
- 📋 서드파티 연동 (ERP, 회계 시스템)
- 📋 클라우드 배포 자동화
- 📋 고급 분석 및 예측 기능

## 📞 지원 및 문의

### 🆘 문제 해결
- **GitHub Issues**: 버그 리포트 및 기능 요청
- **Discussions**: 일반적인 질문 및 토론
- **Wiki**: 상세한 문서 및 가이드

### 📧 연락처
- **프로젝트 관리자**: [GitHub Profile](https://github.com/junyeongccom)
- **이메일**: 프로젝트 이슈를 통해 문의
- **문서**: 프로젝트 Wiki 참조

### 🤝 커뮤니티
- **기여자 가이드**: CONTRIBUTING.md 참조
- **행동 강령**: CODE_OF_CONDUCT.md 준수
- **라이선스**: MIT License

---

**Sky-C**는 기후변화 시대에 기업들이 규제 요구사항을 효율적으로 충족할 수 있도록 돕는 혁신적인 AI 기반 자동화 플랫폼입니다. 🌍✨

*지속가능한 미래를 위한 기후공시, Sky-C와 함께 시작하세요!* 