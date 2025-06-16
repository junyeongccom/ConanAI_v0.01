import os
import re
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, GenerationConfig, BitsAndBytesConfig
from peft import PeftModel, PeftConfig # PeftConfig는 선택 사항, PeftModel만 있어도 로드 가능
from dotenv import load_dotenv
import structlog # 로깅을 위해 추가

# .env 파일에서 환경 변수 로드 (HUGGINGFACE_AUTH_TOKEN 등)
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

# ── 0. 환경 설정 및 GPU 캐시 정리 ───────────────────────────────────────────
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    logger.info("GPU 캐시 메모리가 성공적으로 정리되었습니다.")
else:
    logger.warning("GPU를 사용할 수 없어 캐시 메모리 정리를 건너뜀니다.")

# ── 1. 모델·토크나이저·LoRA 설정 ───────────────────────────────────────────
# 베이스 모델 지정 (Hugging Face ID)
BASE_MODEL_NAME = "MLP-KTLim/llama-3-Korean-Bllossom-8B"

# 로컬에 저장된 베이스 모델 경로
BASE_MODEL_DIR = "/app/models/base_model/llama3-korean-bllossom-8b"

# 훈련된/초기화된 LoRA 어댑터가 저장된 컨테이너 내부 경로를 지정합니다.
# 이 경로는 docker-compose.yml의 volumes 설정과 일치해야 합니다.
# 예: - ./model-training-service/models:/app/models
# 빈 어댑터를 테스트하는 것이 목적이므로 initial_adapters 경로를 사용합니다.
FINETUNED_ADAPTER_PATH = "/app/models/initial_adapters/llama3-init" 

# Hugging Face 인증 토큰 사용 (모델 로드 시 필요)
HF_AUTH_TOKEN = os.getenv("HUGGINGFACE_AUTH_TOKEN")
if not HF_AUTH_TOKEN:
    logger.error("HUGGINGFACE_AUTH_TOKEN 환경 변수가 설정되지 않았습니다. .env 파일에 설정해주세요.")
    raise ValueError("HUGGINGFACE_AUTH_TOKEN이 모델 로드에 필요합니다.")

# BitsAndBytesConfig 설정 (훈련 시 사용했던 것과 동일하게)
# 4bit 양자화를 통해 8GB VRAM에서도 모델을 로드합니다.
bnb_cfg = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

# 토크나이저 로드 (로컬 우선, 없으면 Hugging Face)
if os.path.exists(BASE_MODEL_DIR) and os.path.isdir(BASE_MODEL_DIR):
    logger.info(f"로컬 디렉토리에서 토크나이저 로드 중: {BASE_MODEL_DIR}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_DIR, use_fast=False)
    logger.info("로컬에서 토크나이저 로드 완료.")
else:
    logger.info(f"로컬에 베이스 모델이 없어 Hugging Face에서 토크나이저 로드 중: {BASE_MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME, use_fast=False, token=HF_AUTH_TOKEN)
    logger.info("Hugging Face에서 토크나이저 로드 완료.")

tokenizer.pad_token = tokenizer.eos_token # Llama 3는 <|eot_id|>를 pad_token으로 사용하기도 하지만, eos_token으로 설정해도 무방합니다.

# 베이스 모델 로드 (로컬 우선, 없으면 Hugging Face)
if os.path.exists(BASE_MODEL_DIR) and os.path.isdir(BASE_MODEL_DIR):
    logger.info(f"로컬 디렉토리에서 베이스 모델 로드 중 (4bit 양자화): {BASE_MODEL_DIR}")
    try:
        base_model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_DIR,
            quantization_config=bnb_cfg, # 4bit 양자화 적용
            device_map="auto", # 사용 가능한 GPU에 자동으로 모델 배치
            torch_dtype=torch.float16, # 계산은 FP16으로 수행
            trust_remote_code=True, # Llama 3 모델 로딩 시 필요할 수 있음
        )
        logger.info("로컬에서 베이스 모델 로드 완료.")
    except Exception as e:
        logger.error(f"로컬 베이스 모델 로드 중 오류 발생: {e}. Hugging Face에서 다운로드를 시도합니다.")
        base_model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_NAME,
            quantization_config=bnb_cfg,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
            token=HF_AUTH_TOKEN
        )
        logger.info("Hugging Face에서 베이스 모델 로드 완료.")
else:
    logger.info(f"로컬에 베이스 모델이 없어 Hugging Face에서 로드 중 (4bit 양자화): {BASE_MODEL_NAME}")
    logger.warning("베이스 모델을 먼저 로컬에 저장하려면 generate_initial_model.py를 실행하세요.")
    try:
        base_model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_NAME,
            quantization_config=bnb_cfg, # 4bit 양자화 적용
            device_map="auto", # 사용 가능한 GPU에 자동으로 모델 배치
            torch_dtype=torch.float16, # 계산은 FP16으로 수행
            trust_remote_code=True, # Llama 3 모델 로딩 시 필요할 수 있음
            token=HF_AUTH_TOKEN # Hugging Face 인증 토큰 전달
        )
        logger.info("Hugging Face에서 베이스 모델 로드 완료.")
    except Exception as e:
        logger.error(f"베이스 모델 로드 중 오류 발생: {e}. BitsAndBytes 설정 또는 GPU 메모리를 확인해주세요.")
        raise

logger.info(f"훈련된 LoRA 어댑터 로드 중: {FINETUNED_ADAPTER_PATH}")
try:
    # 훈련된 LoRA 어댑터를 베이스 모델에 연결
    # `FINETUNED_ADAPTER_PATH`가 로컬(컨테이너 내부)에 존재해야 합니다.
    if not (os.path.exists(FINETUNED_ADAPTER_PATH) and os.path.isdir(FINETUNED_ADAPTER_PATH)):
        logger.error(f"어댑터 경로 '{FINETUNED_ADAPTER_PATH}'를 찾을 수 없습니다. 빈 어댑터를 먼저 생성했는지 확인해주세요.")
        raise FileNotFoundError(f"어댑터를 찾을 수 없습니다: {FINETUNED_ADAPTER_PATH}")

    model = PeftModel.from_pretrained(base_model, FINETUNED_ADAPTER_PATH)
    logger.info("LoRA 어댑터 로드 및 베이스 모델에 연결 완료.")
except Exception as e:
    logger.error(f"LoRA 어댑터 로드 실패: {e}. 경로를 확인하거나 어댑터가 올바르게 생성되었는지 확인해주세요.")
    logger.info("어댑터 없이 베이스 모델만으로 추론을 시도합니다.")
    model = base_model # LoRA 로드 실패 시 베이스 모델만 사용 (권장하지 않음, 오류 발생 시 명확히 알림)

model.eval() # 모델을 평가 모드로 설정
logger.info("모델 준비 완료.")

# ── 2. 챗봇 응답 생성 함수 ───────────────────────────────────────────
def generate_response(user_message: str, max_new_tokens: int = 100) -> str:
    # 더 자연스러운 대화 형식의 프롬프트 템플릿
    prompt = f"사용자: {user_message}\n조수: "

    # model.device를 사용하여 모델이 로드된 장치(GPU)로 input_ids를 보냅니다.
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(model.device)

    # GenerationConfig 사용 (더 간결한 응답을 위해 조정)
    gen_config = GenerationConfig(
        max_new_tokens=max_new_tokens,
        num_return_sequences=1,
        do_sample=True,
        top_k=40,
        top_p=0.9,
        temperature=0.8,
        repetition_penalty=1.3,
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=tokenizer.eos_token_id,
        # 특정 토큰에서 생성 중단
        stop_strings=["사용자:", "###", "---", "Q:", "A:"],
    )

    with torch.no_grad():
        output = model.generate(
            input_ids,
            generation_config=gen_config,
        )

    # 생성된 텍스트 디코딩 (프롬프트 제외)
    generated_tokens = output[0][len(input_ids[0]):]  # 입력 프롬프트 제외하고 생성된 부분만
    response = tokenizer.decode(generated_tokens, skip_special_tokens=True)
    
    # 응답 후처리: 불필요한 부분 제거
    response = response.strip()
    
    # 특정 패턴에서 응답 중단
    stop_patterns = ["###", "---", "사용자:", "Q:", "A:", "질문:", "답변:", "예제", "참고자료", "FAQ"]
    for pattern in stop_patterns:
        if pattern in response:
            response = response.split(pattern)[0].strip()
            break
    
    # 첫 번째 문장만 추출 (너무 길면)
    sentences = response.split('.')
    if len(sentences) > 2 and len(response) > 100:
        response = sentences[0] + '.'
    
    return response

# ── 3. 챗봇 대화 루프 ───────────────────────────────────────────
if __name__ == "__main__":
    logger.info("챗봇 테스트를 시작합니다. 'exit'를 입력하면 종료됩니다.")
    if os.path.exists(BASE_MODEL_DIR):
        logger.info(f"현재 로드된 모델: 로컬 베이스 모델 ({BASE_MODEL_DIR}) + {FINETUNED_ADAPTER_PATH} (초기 어댑터)")
    else:
        logger.info(f"현재 로드된 모델: {BASE_MODEL_NAME} + {FINETUNED_ADAPTER_PATH} (초기 어댑터)")
    logger.info("이는 훈련되지 않은 초기 모델이므로, 응답 품질이 낮을 수 있습니다.")

    while True:
        user_input = input("\n질문 입력 (또는 'exit' 입력): ")
        if user_input.lower() == 'exit':
            break
        
        # 특정 키워드에 따른 max_new_tokens 조절은 제거하고 기본 500으로 통일
        # 필요시 사용자 입력에 따라 동적으로 max_new_tokens를 조절하는 로직 추가 가능
        response = generate_response(user_input, max_new_tokens=500)
        
        print(f"\n모델 응답:\n{response}\n")

    logger.info("챗봇 테스트를 종료합니다.")