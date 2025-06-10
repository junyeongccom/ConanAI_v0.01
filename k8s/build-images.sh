#!/bin/bash

echo "🔨 Docker 이미지 빌드 시작..."

# k3d 클러스터 이름
CLUSTER_NAME="conan"

# 1. Gateway 서비스 빌드
echo "📦 Gateway 서비스 빌드 중..."
docker build -t aws-develope-gateway:local ./gateway-service
k3d image import aws-develope-gateway:local -c $CLUSTER_NAME

# 2. Chatbot 서비스 빌드
echo "📦 Chatbot 서비스 빌드 중..."
docker build -t aws-develope-chatbot:local ./chatbot-service
k3d image import aws-develope-chatbot:local -c $CLUSTER_NAME

# 3. n8n 서비스 빌드
echo "📦 n8n 서비스 빌드 중..."
docker build -t n8n-custom:latest ./n8n-service
k3d image import n8n-custom:latest -c $CLUSTER_NAME

# 4. Frontend 빌드
echo "📦 Frontend 빌드 중..."
docker build -t aws-develope-frontend:local ./frontend
k3d image import aws-develope-frontend:local -c $CLUSTER_NAME

echo "✅ 모든 이미지 빌드 및 k3d 클러스터 import 완료!"
echo ""
echo "📋 빌드된 이미지들:"
echo "  - aws-develope-gateway:local"
echo "  - aws-develope-chatbot:local"
echo "  - n8n-custom:latest"
echo "  - aws-develope-frontend:local" 