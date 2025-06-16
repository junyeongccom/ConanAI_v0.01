# 최신 PyTorch 이미지 (CUDA 11.8 지원)를 베이스로 사용
FROM pytorch/pytorch:2.3.0-cuda11.8-cudnn8-runtime

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY ./app /app/app
COPY ./.env /app/.env
COPY ./data /app/data 

# 모델 및 어댑터 저장을 위한 볼륨 마운트 시에 필요
# COPY ./models /app/models # 로컬 마운트할 예정이면 COPY는 하지 않음.

# 컨테이너를 계속 실행 상태로 유지 (훈련 작업을 위해 대기)
# 필요할 때 docker exec로 훈련 스크립트를 실행할 수 있습니다.
CMD ["tail", "-f", "/dev/null"]