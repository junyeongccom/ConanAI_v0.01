FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y git libglib2.0-0 && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# 포트 설정
EXPOSE 8082

# 컨테이너 실행 시 실행할 명령어
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8082", "--reload"]
