# 🔐 Sky-C 인증 시스템 사용 가이드

## 📁 파일 구조

```
frontend/src/
├── shared/
│   ├── store/
│   │   └── authStore.ts           # Zustand 인증 스토어
│   ├── services/
│   │   ├── apiClient.ts          # Axios 기반 API 클라이언트
│   │   └── userService.ts        # 사용자 API 서비스 예시
│   ├── hooks/
│   │   └── useAuth.ts            # 인증 관련 커스텀 훅
│   └── components/
│       ├── AuthInitializer.tsx   # 앱 초기화 시 인증 복구
│       └── AuthStatus.tsx        # 인증 상태 표시 UI
└── domain/
    └── auth/
        ├── services/authService.ts
        ├── hooks/useAuthCallback.ts
        └── components/GoogleLoginButton.tsx
```

## 🚀 주요 기능

### 1. 전역 인증 상태 관리 (Zustand)

```typescript
import { useAuthStore } from '@/shared/store/authStore';

// 직접 스토어 사용
const { isAuthenticated, user, token } = useAuthStore();

// 또는 커스텀 훅 사용 (권장)
import { useAuth } from '@/shared/hooks/useAuth';
const { isLoggedIn, userName, userEmail } = useAuth();
```

### 2. API 클라이언트 (자동 JWT 포함)

```typescript
import { api } from '@/shared/services/apiClient';

// GET 요청
const data = await api.get('/api/climate/data');

// POST 요청
const result = await api.post('/api/reports', { title: 'Report' });

// 파일 업로드
const formData = new FormData();
formData.append('file', file);
const response = await api.upload('/api/upload', formData);
```

### 3. 인증 상태 자동 복구

```typescript
// app/layout.tsx에서 사용
import AuthInitializer from '@/shared/components/AuthInitializer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
```

## 🔧 설정

### 환경변수 (.env.local)

```bash
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
```

## 📝 사용 예시

### 1. 컴포넌트에서 인증 상태 확인

```typescript
'use client';

import { useAuth } from '@/shared/hooks/useAuth';

export default function MyComponent() {
  const { isLoggedIn, userName, logout } = useAuth();

  if (!isLoggedIn) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h1>안녕하세요, {userName}님!</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

### 2. API 호출

```typescript
import { api, handleApiError } from '@/shared/services/apiClient';

const fetchUserData = async () => {
  try {
    const userData = await api.get('/api/user/profile');
    console.log('사용자 정보:', userData);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('API 오류:', apiError.message);
  }
};
```

### 3. 인증이 필요한 페이지 보호

```typescript
'use client';

import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return <div>인증 확인 중...</div>;
  }

  return <div>보호된 페이지 내용</div>;
}
```

## 🔄 자동 처리 기능

### 1. JWT 토큰 자동 포함
- 모든 API 요청에 `Authorization: Bearer {token}` 헤더가 자동으로 추가됩니다.

### 2. 인증 오류 자동 처리
- 401/403 응답 시 자동으로 로그아웃하고 로그인 페이지로 리다이렉트합니다.

### 3. 토큰 만료 확인
- JWT 디코딩 시 만료 시간을 자동으로 확인하고 무효한 토큰을 제거합니다.

### 4. 영속성 관리
- 사용자 정보는 localStorage에 저장되어 브라우저 재시작 후에도 유지됩니다.
- JWT 토큰은 별도의 localStorage와 쿠키에 안전하게 저장됩니다.

## ⚡ 성능 최적화

### 1. 순환 참조 방지
- API 클라이언트에서 동적 import를 사용하여 순환 참조를 방지합니다.

### 2. 선택적 렌더링
- Zustand의 선택자 기능을 활용하여 필요한 상태만 구독합니다.

```typescript
// 특정 필드만 구독
const userEmail = useAuthStore(state => state.user?.email);
```

## 🛡️ 보안 고려사항

1. **토큰 저장**: 쿠키는 `secure`, `sameSite: 'strict'` 설정으로 보호
2. **만료 확인**: JWT 만료 시간 자동 검증
3. **자동 로그아웃**: 인증 오류 시 즉시 상태 초기화
4. **HTTPS**: 프로덕션 환경에서는 HTTPS 사용 필수 