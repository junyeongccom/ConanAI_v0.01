# n8n 워크플로우 자동화 서비스

이 디렉토리는 ConanAI MSA 프로젝트의 n8n 워크플로우 자동화 서비스를 포함합니다.

## 🚀 기능

- **Slack 알림**: HTTP 웹훅을 통한 Slack 메시지 자동 전송
- **워크플로우 자동화**: 다양한 비즈니스 프로세스 자동화
- **MSA 통합**: 기존 마이크로서비스와 완전 통합

## 📦 배포

### 전체 스택 배포
```bash
# 모든 이미지 빌드
./k8s/build-images.sh

# 전체 서비스 배포
./k8s/deploy.sh
# 또는 PowerShell
./deploy.ps1
```

### n8n만 개별 배포
```bash
# 이미지 빌드
docker build -t n8n-custom:latest ./n8n-service
k3d image import n8n-custom:latest -c conan

# Kubernetes 배포
kubectl apply -f k8s/n8n-secrets.yaml
kubectl apply -f k8s/n8n.yaml
```

## 🌐 접속

배포 완료 후 다음 URL에서 접속 가능합니다:
- **n8n UI**: http://localhost:1123/n8n

## 🔧 Slack 설정

### 1. Slack Webhook URL 설정

실제 Slack Webhook URL을 사용하려면:

```bash
# Slack Webhook URL을 base64로 인코딩
echo -n "https://hooks.slack.com/services/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" | base64

# k8s/n8n-secrets.yaml 파일의 slack_webhook 값 업데이트
kubectl apply -f k8s/n8n-secrets.yaml
```

### 2. Slack 앱 설정

1. https://api.slack.com/apps 에서 새 앱 생성
2. "Incoming Webhooks" 활성화
3. 워크스페이스에 앱 설치
4. Webhook URL 복사

## 📋 워크플로우 예시

### Slack 알림 워크플로우

`./workflows/slack-notification-workflow.json` 파일을 n8n에 import하여 사용할 수 있습니다.

#### 워크플로우 구조:
1. **HTTP Webhook 트리거** → 2. **메시지 변환** → 3. **Slack 전송** → 4. **응답 처리**

#### API 호출 예시:

```bash
# 기본 알림
curl -X POST http://localhost:1123/n8n/webhook/slack-notification \
  -H "Content-Type: application/json" \
  -d '{
    "message": "시스템 알림입니다.",
    "title": "배포 완료",
    "status": "SUCCESS",
    "service": "frontend",
    "environment": "production"
  }'

# 에러 알림
curl -X POST http://localhost:1123/n8n/webhook/slack-notification \
  -H "Content-Type: application/json" \
  -d '{
    "message": "서비스에 오류가 발생했습니다.",
    "title": "시스템 오류",
    "status": "ERROR",
    "color": "danger",
    "service": "gateway",
    "environment": "production",
    "description": "API 응답 시간 초과"
  }'
```

#### 메시지 필드:
- `message`: 기본 메시지 (필수)
- `title`: 제목
- `status`: 상태 (INFO, SUCCESS, WARNING, ERROR)
- `color`: 메시지 색상 (good, warning, danger)
- `service`: 서비스 이름
- `environment`: 환경 (development, staging, production)
- `description`: 상세 설명
- `channel`: Slack 채널 (기본: #general)
- `username`: 봇 이름 (기본: ConanAI Bot)
- `icon_emoji`: 이모지 (기본: :robot_face:)

## 🔄 다른 서비스와의 연동

### FastAPI 서비스에서 알림 전송

```python
import requests
import json

def send_slack_notification(message, title="알림", status="INFO", service="api"):
    webhook_url = "http://n8n:80/webhook/slack-notification"
    
    payload = {
        "message": message,
        "title": title,
        "status": status,
        "service": service,
        "environment": "production"
    }
    
    try:
        response = requests.post(webhook_url, json=payload)
        return response.status_code == 200
    except Exception as e:
        print(f"Slack 알림 전송 실패: {e}")
        return False

# 사용 예시
send_slack_notification(
    message="사용자 등록이 완료되었습니다.",
    title="사용자 관리",
    status="SUCCESS",
    service="user-service"
)
```

### Next.js에서 알림 전송

```javascript
const sendSlackNotification = async (message, options = {}) => {
  const payload = {
    message,
    title: options.title || "프론트엔드 알림",
    status: options.status || "INFO",
    service: "frontend",
    environment: "production",
    ...options
  };

  try {
    const response = await fetch('/n8n/webhook/slack-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Slack 알림 전송 실패:', error);
    return false;
  }
};

// 사용 예시
sendSlackNotification(
  "파일 업로드가 완료되었습니다.", 
  { 
    title: "파일 처리", 
    status: "SUCCESS" 
  }
);
```

## 🛠️ 추가 워크플로우 생성

n8n UI에서 다음과 같은 워크플로우를 추가로 생성할 수 있습니다:

1. **이메일 알림**: SMTP를 통한 이메일 발송
2. **데이터베이스 모니터링**: 주기적 DB 상태 확인
3. **파일 처리**: 업로드된 파일 자동 처리
4. **API 모니터링**: 외부 API 상태 확인
5. **일정 작업**: 크론 기반 정기 작업

## 📚 참고 자료

- [n8n 공식 문서](https://docs.n8n.io/)
- [Slack Webhook 가이드](https://api.slack.com/messaging/webhooks)
- [n8n 노드 라이브러리](https://docs.n8n.io/integrations/builtin/app-nodes/) 