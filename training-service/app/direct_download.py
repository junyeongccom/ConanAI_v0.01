#!/usr/bin/env python3

import os
from huggingface_hub import snapshot_download
from dotenv import load_dotenv
import structlog

# .env 파일에서 환경 변수 로드
load_dotenv()

# 로깅 설정
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logger = structlog.get_logger(__name__)

# 설정
BASE_MODEL = "MLP-KTLim/llama-3-Korean-Bllossom-8B"
BASE_MODEL_DIR = "/app/models/base_model/llama3-korean-bllossom-8b"

# Hugging Face 인증 토큰
HF_AUTH_TOKEN = os.getenv("HUGGINGFACE_AUTH_TOKEN")
if not HF_AUTH_TOKEN:
    logger.error("HUGGINGFACE_AUTH_TOKEN 환경 변수가 설정되지 않았습니다.")
    raise ValueError("HUGGINGFACE_AUTH_TOKEN이 필요합니다.")

try:
    logger.info(f"모델 다운로드 시작: {BASE_MODEL}")
    logger.info(f"저장 경로: {BASE_MODEL_DIR}")
    
    # huggingface_hub를 사용해서 전체 리포지토리 다운로드
    snapshot_download(
        repo_id=BASE_MODEL,
        local_dir=BASE_MODEL_DIR,
        token=HF_AUTH_TOKEN,
        local_dir_use_symlinks=False,  # 심볼릭 링크 대신 실제 파일 복사
        resume_download=True  # 중단된 다운로드 재개
    )
    
    logger.info("모델 다운로드 완료!")
    
    # 저장된 파일 목록 출력
    files = os.listdir(BASE_MODEL_DIR)
    logger.info(f"다운로드된 파일들: {files}")
    
    # .safetensors 파일 확인
    safetensor_files = [f for f in files if f.endswith('.safetensors')]
    logger.info(f"모델 파일들 (.safetensors): {safetensor_files}")
    
    if safetensor_files:
        logger.info("✅ 모델 파일들이 성공적으로 다운로드되었습니다!")
    else:
        logger.warning("⚠️ .safetensors 파일들이 발견되지 않았습니다.")
        
except Exception as e:
    logger.error(f"다운로드 중 오류 발생: {e}")
    raise 