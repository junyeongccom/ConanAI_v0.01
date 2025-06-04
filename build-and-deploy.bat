@echo off
echo 🔨 Docker 이미지 빌드 시작...
"C:\Program Files\Git\bin\bash.exe" k8s/build-images.sh

echo.
echo 🚀 Kubernetes 배포 시작...
"C:\Program Files\Git\bin\bash.exe" k8s/deploy.sh

echo.
echo 🔄 Pod 재시작 중...
kubectl rollout restart deployment frontend
kubectl rollout restart deployment gateway
kubectl rollout restart deployment dsdgen
kubectl rollout restart deployment dsdcheck

echo.
echo ⏳ Pod 준비 대기 중...
kubectl wait --for=condition=ready pod -l app=frontend --timeout=60s
kubectl wait --for=condition=ready pod -l app=gateway --timeout=60s
kubectl wait --for=condition=ready pod -l app=dsdgen --timeout=60s

echo.
echo ✅ 빌드 및 배포 완료!
echo 🌐 접속 URL: http://localhost:1123 