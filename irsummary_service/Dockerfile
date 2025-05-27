FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 설치 (Camelot, OpenCV 종속성)
RUN apt-get update && apt-get install -y \
    build-essential \
    ghostscript \
    python3-dev \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8083", "--reload"]