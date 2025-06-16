# 🔐 Google OAuth 설정 가이드

## ✅ 완료된 Google OAuth 구현

**Google OAuth Authorization Code Flow**가 완전히 구현되었습니다!

### 🔄 **구현된 인증 흐름**

1. **사용자 로그인 시작** → `http://localhost:8080/auth/google/login`
2. **Google 인증 서버로 리다이렉트** → Google 로그인 페이지
3. **사용자 인증 완료** → Google이 authorization code와 함께 콜백
4. **토큰 교환** → Authorization code를 id_token으로 교환
5. **ID 토큰 검증** → Google 공개 키로 안전하게 검증
6. **사용자 처리** → 자동 회원가입/로그인
7. **JWT 발급** → 우리 서비스의 JWT 토큰 생성
8. **프론트엔드 리다이렉트** → `/auth/success?token=JWT_TOKEN`

## 🛠️ 설정 단계

### 1. Google Cloud Console 설정

1. **Google Cloud Console** 접속: https://console.cloud.google.com/
2. **새 프로젝트 생성** 또는 기존 프로젝트 선택
3. **API 및 서비스 → 사용자 인증 정보** 이동
4. **사용자 인증 정보 만들기 → OAuth 2.0 클라이언트 ID** 선택
5. **애플리케이션 유형**: 웹 애플리케이션
6. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:8080/auth/google/callback
   ```
7. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사

### 2. 환경 변수 설정

각 서비스의 `.env` 파일에 다음 환경 변수를 추가:

#### **Gateway Service (.env)**
```bash
# JWT 설정
JWT_SECRET_KEY=your_super_secret_jwt_key_here_minimum_32_chars
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Auth Service 연결
AUTH_SERVICE_URL=http://auth:8084
```

#### **Auth Service (.env)**
```bash
# 데이터베이스 연결
DATABASE_URL=postgresql://hc_user:hc_password@postgres:5432/hc_db

# JWT 설정 (Gateway와 동일해야 함)
JWT_SECRET_KEY=your_super_secret_jwt_key_here_minimum_32_chars
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback

# 프론트엔드 URL
FRONTEND_URL=http://localhost:3000
```

#### **프론트엔드 (.env.local)**
```bash
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
```

### 3. 보안 JWT 키 생성

강력한 JWT Secret Key를 생성하려면:

```bash
# Python으로 생성
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 또는 OpenSSL로 생성
openssl rand -base64 32
```

## 🧪 테스트 방법

### 1. 모든 서비스 시작
```bash
docker-compose up -d
```

### 2. 서비스 상태 확인
```bash
# Gateway 서비스 확인
curl http://localhost:8080/api/health

# Auth 서비스 확인
curl http://localhost:8084/auth/health
```

### 3. Google 로그인 테스트
1. 브라우저에서 `http://localhost:3000` 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정으로 로그인
4. 자동으로 메인 페이지로 리다이렉트 확인

### 4. 로그 확인
```bash
# Auth 서비스 로그 확인
docker-compose logs -f auth

# Gateway 서비스 로그 확인
docker-compose logs -f gateway
```

## 🛡️ 보안 고려사항

### 1. **HTTPS 사용 (프로덕션)**
- 프로덕션 환경에서는 반드시 HTTPS 사용
- 리다이렉트 URI도 HTTPS로 변경

### 2. **환경 변수 보안**
- `.env` 파일은 절대 Git에 커밋하지 않음
- 프로덕션에서는 환경 변수를 안전하게 관리

### 3. **CORS 설정**
- 프로덕션에서는 허용된 도메인만 CORS 허용

### 4. **JWT 만료 시간**
- 적절한 토큰 만료 시간 설정 (기본: 24시간)

## 🔧 문제 해결

### 1. **"Google OAuth 설정이 누락되었습니다" 오류**
- `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET` 환경 변수 확인
- 환경 변수가 올바르게 설정되었는지 확인

### 2. **"redirect_uri_mismatch" 오류**
- Google Cloud Console의 리다이렉트 URI 설정 확인
- `GOOGLE_REDIRECT_URI` 환경 변수와 일치하는지 확인

### 3. **"Invalid token" 오류**
- JWT Secret Key가 Gateway와 Auth 서비스에서 동일한지 확인
- 토큰 만료 시간 확인

### 4. **데이터베이스 연결 오류**
- PostgreSQL 컨테이너가 실행 중인지 확인
- 데이터베이스 연결 정보 확인

## 📊 구현된 기능

### ✅ **백엔드 (Auth Service)**
- [x] Google OAuth Authorization Code Flow
- [x] ID 토큰 안전 검증 (google-auth 라이브러리)
- [x] 자동 회원가입/로그인
- [x] JWT 토큰 발급
- [x] 사용자 세션 관리
- [x] 상세한 로깅 및 오류 처리

### ✅ **프론트엔드**
- [x] Google 로그인 버튼
- [x] 인증 상태 관리 (Zustand)
- [x] 자동 토큰 처리
- [x] 인증 성공/실패 페이지
- [x] 마이페이지 기능
- [x] 반응형 Header UI

### ✅ **Gateway Service**
- [x] Google OAuth 프록시 라우팅
- [x] JWT 인증 미들웨어
- [x] 사용자 ID 전달 (X-User-Id 헤더)

## 🚀 사용 준비 완료!

위의 환경 변수만 올바르게 설정하면 완전한 Google OAuth 로그인 시스템이 작동합니다!

---

**💡 팁**: 환경 변수를 설정한 후 반드시 서비스를 재시작하세요:
```bash
docker-compose restart auth gateway
``` 