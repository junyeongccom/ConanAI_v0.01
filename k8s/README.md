# Kubernetes 배포 가이드

이 디렉토리는 `aws_develope` 프로젝트를 k3d 기반 Kubernetes 환경에서 실행하기 위한 매니페스트 파일들을 포함합니다.

## 📋 구성 요소

### 서비스들
- **PostgreSQL** (`postgres.yaml`) - 데이터베이스
- **Gateway** (`gateway.yaml`) - 메인 API 게이트웨이 (포트: 8080)
- **DSDGen** (`dsdgen.yaml`) - DSD 생성 서비스 (포트: 8085)
- **DSDCheck** (`dsdcheck.yaml`) - DSD 검증 서비스 (포트: 8086)
- **Frontend** (`frontend.yaml`) - Next.js 웹 프론트엔드 (포트: 3000)

### 네트워킹
- **Ingress** (`ingress.yaml`) - 외부 접근을 위한 라우팅

## 🚀 배포 방법

### 1. k3d 클러스터 생성
```bash
k3d cluster create conan --port 1123:80@loadbalancer
```

### 2. Docker 이미지 빌드 및 Import
```bash
cd k8s
chmod +x build-images.sh
./build-images.sh
```

### 3. Kubernetes 배포
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🌐 접속 URL

배포 완료 후 다음 URL로 접근할 수 있습니다:

- **Frontend**: http://localhost:1123
- **API Gateway**: http://localhost:1123/api

## 📊 상태 확인

```bash
# Pod 상태 확인
kubectl get pods

# 서비스 상태 확인
kubectl get services

# Ingress 상태 확인
kubectl get ingress

# 로그 확인
kubectl logs -l app=gateway
kubectl logs -l app=frontend
```

## 🔧 개별 배포

필요시 개별 서비스만 배포할 수 있습니다:

```bash
# PostgreSQL만 배포
kubectl apply -f postgres.yaml

# Gateway만 배포
kubectl apply -f gateway.yaml

# Frontend만 배포
kubectl apply -f frontend.yaml
```

## 🗑️ 정리

```bash
# 모든 리소스 삭제
kubectl delete -f .

# k3d 클러스터 삭제
k3d cluster delete conan
```

## 📝 주요 설정

### 환경변수
- `NEXT_PUBLIC_API_URL`: `http://gateway:8080`
- `DATABASE_URL`: `postgresql://hc_user:hc_password@postgres:5432/hc_db`

### 리소스 제한
- **Gateway/DSDGen/DSDCheck**: 256Mi-512Mi RAM, 250m-500m CPU
- **Frontend**: 512Mi-1Gi RAM, 250m-500m CPU
- **PostgreSQL**: 256Mi-512Mi RAM, 250m-500m CPU

### 볼륨 마운트
- **PostgreSQL**: `/tmp/postgres_data`
- **DSDGen**: `/tmp/dart_documents`
- **DSDCheck**: `/tmp/dsdcheck_resources` 