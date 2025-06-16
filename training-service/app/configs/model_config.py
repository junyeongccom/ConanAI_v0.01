# app/configs/model_config.py

import torch
from transformers import BitsAndBytesConfig
from peft import LoraConfig

# 베이스 모델 정보
BASE_MODEL_NAME = "MLP-KTLim/llama-3-Korean-Bllossom-8B"

# 초기화된 어댑터 경로 (이 어댑터 위에서 학습을 시작)
INITIAL_ADAPTER_PATH = "/app/models/initial_adapters/llama3-init" # 컨테이너 내부 경로로 지정

# 훈련된 어댑터 저장 경로
TRAINED_ADAPTER_OUTPUT_DIR = "/app/models/trained_adapters/tcfd-slm-250613-a" # 컨테이너 내부 경로로 지정

# BitsAndBytes 양자화 설정 (RTX 2080 8GB VRAM에 최적화)
BNB_CONFIG = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

# LoRA 설정
LORA_CONFIG = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    # Llama 3 모델에 권장되는 target_modules
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
)