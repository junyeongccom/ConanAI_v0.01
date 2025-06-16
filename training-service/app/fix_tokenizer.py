#!/usr/bin/env python3

import os
from transformers import AutoTokenizer
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
    logger.info("토크나이저 다운로드 중...")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False, token=HF_AUTH_TOKEN)
    
    logger.info(f"토크나이저를 {BASE_MODEL_DIR}에 저장 중...")
    tokenizer.save_pretrained(BASE_MODEL_DIR)
    
    logger.info("✅ 토크나이저 저장 완료!")
    
    # 저장된 파일 목록 출력
    files = os.listdir(BASE_MODEL_DIR)
    tokenizer_files = [f for f in files if 'tokenizer' in f.lower() or 'special_tokens' in f.lower()]
    logger.info(f"토크나이저 관련 파일들: {tokenizer_files}")
    
except Exception as e:
    logger.error(f"토크나이저 다운로드 중 오류 발생: {e}")
    raise 