#!/bin/bash

echo "🚀 Kubernetes 배포 시작..."

# 스크립트가 있는 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. PostgreSQL 먼저 배포
echo "📦 PostgreSQL 배포 중..."
kubectl apply -f postgres.yaml

# PostgreSQL이 준비될 때까지 대기
echo "⏳ PostgreSQL 준비 대기 중..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=60s

# 2. Secrets 배포
echo "📦 Secrets 배포 중..."
kubectl apply -f n8n-secrets.yaml

# 3. 백엔드 서비스들 배포
echo "📦 백엔드 서비스들 배포 중..."
kubectl apply -f gateway.yaml
kubectl apply -f dsdgen.yaml
kubectl apply -f dsdcheck.yaml

# 백엔드 서비스들이 준비될 때까지 대기
echo "⏳ 백엔드 서비스들 준비 대기 중..."
kubectl wait --for=condition=ready pod -l app=gateway --timeout=60s
kubectl wait --for=condition=ready pod -l app=dsdgen --timeout=60s
kubectl wait --for=condition=ready pod -l app=dsdcheck --timeout=60s

# 4. n8n 서비스 배포
echo "📦 n8n 서비스 배포 중..."
kubectl apply -f n8n.yaml

# n8n이 준비될 때까지 대기
echo "⏳ n8n 서비스 준비 대기 중..."
kubectl wait --for=condition=ready pod -l app=n8n --timeout=60s

# 5. 프론트엔드 배포
echo "📦 프론트엔드 배포 중..."
kubectl apply -f frontend.yaml

# 프론트엔드가 준비될 때까지 대기
echo "⏳ 프론트엔드 준비 대기 중..."
kubectl wait --for=condition=ready pod -l app=frontend --timeout=60s

# 6. Ingress 배포
echo "📦 Ingress 배포 중..."
kubectl apply -f ingress.yaml

echo "✅ 배포 완료!"
echo ""
echo "🌐 접속 URL:"
echo "  - Frontend: http://localhost:1123"
echo "  - API Gateway: http://localhost:1123/api"
echo "  - n8n 워크플로우: http://localhost:1123/n8n"
echo ""
echo "📊 상태 확인:"
kubectl get pods
echo ""
kubectl get services
echo ""
kubectl get ingress 