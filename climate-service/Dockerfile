# Python 3.12를 기반으로 한 슬림 이미지 사용
FROM python:3.12.7-slim

# 작업 디렉터리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    libgdal-dev \
    libproj-dev \
    libgeos-dev \
    libhdf5-dev \
    libnetcdf-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 파일 복사
COPY requirements.txt .

# Python 패키지 설치
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY app/ ./app/

# 환경변수 설정
ENV PYTHONPATH=/app
ENV PORT=8087

# 비root 사용자 생성 및 전환 (보안)
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app
USER appuser

# 포트 노출
EXPOSE 8087

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8087/health')" || exit 1

# 애플리케이션 실행 - uvicorn을 직접 사용
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8087", "--reload"] 