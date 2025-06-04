# n8n 워크플로우 자동화 도구
FROM n8nio/n8n:latest

# 한국 시간대 설정
ENV TZ=Asia/Seoul
ENV GENERIC_TIMEZONE=Asia/Seoul

# n8n 기본 설정
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=http
ENV NODE_ENV=production
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false

# 데이터 디렉토리 권한 설정
USER root
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n
RUN mkdir -p /data/workflows && chown -R node:node /data/workflows

# 권한 설정
RUN chown -R node:node /home/node/.n8n

# 작업 디렉토리 설정
WORKDIR /home/node

# 포트 노출
EXPOSE 5678

# n8n 사용자로 전환하여 실행
USER node

# n8n 시작 - 기본 엔트리포인트 사용
CMD ["start"] 