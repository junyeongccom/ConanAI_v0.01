# 챗봇 서비스

이 서비스는 허깅페이스의 `junyeongc/tcfd-slm-finetuned-polyglot-ko-1.3b` 모델을 사용하여 TCFD 관련 질문에 답변하는 챗봇 서비스입니다.

## 환경 설정

### 1. 허깅페이스 토큰 설정

1. [허깅페이스 토큰 페이지](https://huggingface.co/settings/tokens)에서 새 토큰을 생성합니다.
2. 토큰 타입은 "Read" 권한으로 설정합니다.
3. 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

```bash
# .env 파일
HUGGINGFACE_TOKEN=your_actual_token_here
PORT=8003
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 서비스 실행

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8003
```

## API 사용법

### POST /chat
```json
{
  "message": "TCFD가 무엇인가요?"
}
```

### 응답
```json
{
  "response": "TCFD는 기후관련 재무정보 공시 태스크포스..."
}
```

## 주요 변경사항

- 로컬 모델 로딩 → 허깅페이스 API 사용
- GPU 의존성 제거
- 더 빠른 응답 시간
- 메모리 사용량 감소 