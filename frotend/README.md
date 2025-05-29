# Sky-C PWA

Sky-C는 AWS 클라우드 개발 플랫폼으로, Progressive Web App(PWA) 기능을 지원합니다.

## PWA 기능

### 🚀 주요 기능
- **오프라인 지원**: 인터넷 연결이 없어도 기본 기능 사용 가능
- **홈 화면 설치**: 모바일 기기의 홈 화면에 앱처럼 설치 가능
- **푸시 알림**: 중요한 업데이트 및 알림 수신
- **빠른 로딩**: 캐싱을 통한 빠른 페이지 로딩
- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험

### 📱 설치 방법

#### Android (Chrome)
1. 웹사이트 방문
2. 주소창 옆의 "설치" 버튼 클릭
3. "설치" 확인

#### iOS (Safari)
1. 웹사이트 방문
2. 공유 버튼 (⬆️) 탭
3. "홈 화면에 추가" 선택
4. "추가" 탭

#### Desktop (Chrome/Edge)
1. 웹사이트 방문
2. 주소창 옆의 설치 아이콘 클릭
3. "설치" 확인

## 개발 정보

### PWA 구성 요소

- **Manifest**: `/public/manifest.json` - 앱 메타데이터
- **Service Worker**: 자동 생성 (next-pwa)
- **아이콘**: `/public/icon/` 폴더의 다양한 크기 아이콘
- **오프라인 페이지**: `/public/offline.html`

### 기술 스택

- **Next.js 15**: React 프레임워크
- **next-pwa**: PWA 기능 구현
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링

### 개발 명령어

```bash
# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

### PWA 테스트

1. 프로덕션 빌드 실행
2. Chrome DevTools > Application > Manifest 확인
3. Lighthouse PWA 점수 확인
4. 오프라인 모드에서 테스트

## 브라우저 지원

- ✅ Chrome (Android/Desktop)
- ✅ Safari (iOS/macOS)
- ✅ Edge (Desktop)
- ✅ Firefox (Desktop)
- ✅ Samsung Internet

## 문제 해결

### 캐시 문제
- 브라우저 캐시 삭제
- Service Worker 재등록

### 설치 버튼이 보이지 않는 경우
- HTTPS 연결 확인
- Manifest 파일 유효성 검사
- 최소 요구사항 충족 확인

## 라이센스

MIT License 