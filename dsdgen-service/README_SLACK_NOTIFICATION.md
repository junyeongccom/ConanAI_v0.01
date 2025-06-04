# DSDGen 서비스 Slack 알림 기능

## 🔧 개요

dsdgen-service에 Slack 알림 기능이 추가되었습니다. DSD 데이터 생성이 완료되거나 실패할 때 자동으로 Slack으로 알림을 보냅니다.

## 📁 파일 구조

```
dsdgen-service/
├── app/
│   ├── platform/
│   │   └── notification/
│   │       ├── __init__.py
│   │       └── slack_notifier.py      # Slack 알림 전송 모듈
│   │   └── ...
│   ├── domain/
│   │   ├── service/
│   │   │   └── dsd_auto_fetch_service.py   # DSD 생성 + 알림 로직
│   │   └── ...
│   ├── api/
│   │   └── dsdgen_router.py           # 테스트 엔드포인트 추가
│   └── ...
└── README_SLACK_NOTIFICATION.md
```

## ⚙️ 설정

### 환경변수

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `N8N_WEBHOOK_URL` | `http://localhost:5678/webhook/slack-notification` | n8n Webhook URL |

### n8n 설정

1. n8n에서 Webhook 노드 생성
2. Webhook URL을 `/webhook/slack-notification`으로 설정
3. Slack 연동 워크플로우 구성

## 🚀 사용법

### 1. 자동 알림 (DSD 생성 시)

DSD 자동 생성 API를 호출하면 자동으로 알림이 전송됩니다:

```bash
# DSD 자동 생성 (성공/실패 시 자동 알림)
curl -X GET "http://localhost:8085/dsdgen/dsd-auto-fetch?corp_code=00126380"
```

### 2. 수동 알림 테스트

```bash
# Slack 알림 테스트
curl -X POST "http://localhost:8085/dsdgen/test-slack-notification?message=테스트메시지&title=테스트&status=SUCCESS"
```

### 3. 코드에서 직접 호출

```python
from app.platform.notification import send_slack_notification

# 성공 알림
await send_slack_notification(
    message="DSD 데이터 생성이 완료되었습니다.",
    title="DSD 생성 완료",
    status="SUCCESS",
    service="dsdgen",
    corp_code="00126380",
    data_count=150
)

# 실패 알림
await send_slack_notification(
    message="DSD 데이터 생성 중 오류가 발생했습니다.",
    title="DSD 생성 실패", 
    status="ERROR",
    service="dsdgen",
    corp_code="00126380",
    error="Database connection failed"
)
```

## 📨 알림 메시지 형식

### 성공 알림

```json
{
  "message": "기업코드 00126380의 DSD 데이터 생성이 완료되었습니다. (총 150건)",
  "title": "DSD 생성 완료",
  "status": "SUCCESS",
  "service": "dsdgen",
  "corp_code": "00126380",
  "data_count": 150,
  "environment": "production"
}
```

### 실패 알림

```json
{
  "message": "기업코드 00126380의 DSD 데이터 생성 중 오류가 발생했습니다.\n오류: Database connection failed",
  "title": "DSD 생성 실패",
  "status": "ERROR", 
  "service": "dsdgen",
  "corp_code": "00126380",
  "error": "Database connection failed",
  "environment": "production"
}
```

## 🔍 알림 발생 시점

### 성공 알림
- DSD 데이터 생성 완료 후
- DB에 데이터 저장 확인 후

### 실패 알림
- OpenDART XBRL 파일 다운로드 실패
- XBRL 파일 파싱 실패
- DB 저장 실패
- 기타 예외 발생

## 🛠️ 커스터마이징

### 알림 메시지 수정

`dsd_auto_fetch_service.py`의 다음 메소드를 수정:

```python
async def _send_success_notification(self, corp_code: str, data_count: int)
async def _send_failure_notification(self, corp_code: str, error_message: str)
```

### 새로운 알림 추가

```python
from app.platform.notification import send_slack_notification

await send_slack_notification(
    message="커스텀 메시지",
    title="커스텀 제목",
    status="INFO",
    service="dsdgen",
    custom_field="커스텀 값"
)
```

## 🔗 API 엔드포인트

### DSD 자동 생성 (알림 포함)
- **URL**: `GET /dsdgen/dsd-auto-fetch`
- **Parameters**: `corp_code` (필수)
- **알림**: 성공/실패 시 자동 전송

### Slack 알림 테스트
- **URL**: `POST /dsdgen/test-slack-notification`
- **Parameters**: 
  - `message` (선택, 기본값: "테스트 메시지입니다.")
  - `title` (선택, 기본값: "테스트 알림")
  - `status` (선택, 기본값: "INFO")

## 🐛 트러블슈팅

### 알림이 전송되지 않을 때

1. **n8n 서비스 확인**
   ```bash
   curl http://localhost:5678/webhook/slack-notification
   ```

2. **로그 확인**
   ```bash
   docker-compose logs dsdgen
   ```

3. **환경변수 확인**
   ```python
   import os
   print(os.getenv("N8N_WEBHOOK_URL"))
   ```

### 일반적인 오류

- **Connection refused**: n8n 서비스가 실행되지 않음
- **Timeout**: n8n 서비스 응답 지연 (10초 타임아웃)
- **HTTP 4xx/5xx**: n8n Webhook 설정 오류

## 📋 로그 레벨

```python
# 성공/실패 정보
logger.info("Slack 알림 전송 성공: %s", title)

# 오류 정보  
logger.error("Slack 알림 전송 실패 - HTTP %d: %s", status_code, response.text)
logger.error("Slack 알림 전송 타임아웃: %s", title)
logger.error("Slack 알림 전송 오류: %s - %s", title, str(e))
``` 