# model-training-service/app/generate_initial_adapter.py

import os, torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
import warnings
from dotenv import load_dotenv # .env 파일 로드
import structlog # 로깅을 위해 추가
import glob
import shutil

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

# 경고 메시지 무시
warnings.filterwarnings("ignore")

# ── 0. 환경 설정 및 GPU 캐시 정리 ───────────────────────────────────────────
# Docker 컨테이너 환경에서는 CUDA_VISIBLE_DEVICES는 Dockerfile/docker-compose.yml에서 설정됩니다.
# 로컬에서 직접 실행할 경우를 대비하여 유지할 수 있습니다.
# os.environ["CUDA_VISIBLE_DEVICES"] = "0" # 컨테이너 환경에서는 Docker Compose의 deploy.resources로 제어

if torch.cuda.is_available():
    torch.cuda.empty_cache()
    logger.info("GPU cache memory successfully cleared.")
else:
    logger.warning("GPU not available, skipping cache memory clear.")

# ── 1. 베이스 모델 & 토크나이저 설정 ─────────────────────────────────────────
# 베이스 모델 지정 (MLP-KTLim/llama-3-Korean-Bllossom-8B)
BASE_MODEL = "MLP-KTLim/llama-3-Korean-Bllossom-8B"

# 베이스 모델을 저장할 경로 (컨테이너 내부 경로)
BASE_MODEL_DIR = "/app/models/base_model/llama3-korean-bllossom-8b"

# 초기화된 어댑터를 저장할 경로 (컨테이너 내부 경로)
# 이 경로는 docker-compose.yml의 volumes 설정과 일치해야 합니다.
# 예: - ./model-training-service/models:/app/models
INIT_DIR = "/app/models/initial_adapters/llama3-init"

# Hugging Face 인증 토큰 사용
hf_auth_token = os.getenv("HUGGINGFACE_AUTH_TOKEN")
if not hf_auth_token:
    logger.error("HUGGINGFACE_AUTH_TOKEN environment variable not set. Please set it in .env file.")
    raise ValueError("HUGGINGFACE_AUTH_TOKEN is required to load the model.")

# ── 2. HuggingFace 캐시에서 모델 찾기 ───────────────────────────────────────────
def find_cached_model():
    """HuggingFace 캐시에서 모델을 찾는 함수"""
    cache_pattern = "/root/.cache/huggingface/hub/models--MLP-KTLim--llama-3-Korean-Bllossom-8B/snapshots/*/
    snapshot_dirs = glob.glob(cache_pattern)
    
    if snapshot_dirs:
        # 가장 최근 스냅샷 디렉토리 선택
        latest_snapshot = max(snapshot_dirs, key=os.path.getmtime)
        logger.info(f"Found cached model at: {latest_snapshot}")
        return latest_snapshot.rstrip('/')
    return None

def copy_cached_model_to_local(cached_dir, local_dir):
    """캐시된 모델을 로컬 디렉토리로 복사"""
    try:
        os.makedirs(local_dir, exist_ok=True)
        
        # 캐시 디렉토리의 모든 파일 복사
        for item in os.listdir(cached_dir):
            source = os.path.join(cached_dir, item)
            target = os.path.join(local_dir, item)
            
            if os.path.islink(source):
                # 심볼릭 링크인 경우 실제 파일을 복사
                real_source = os.path.realpath(source)
                shutil.copy2(real_source, target)
                logger.info(f"Copied linked file: {item}")
            elif os.path.isfile(source):
                shutil.copy2(source, target)
                logger.info(f"Copied file: {item}")
        
        logger.info(f"Successfully copied cached model to: {local_dir}")
        return True
    except Exception as e:
        logger.error(f"Failed to copy cached model: {e}")
        return False

# ── 3. 베이스 모델이 이미 로컬에 있는지 확인 또는 캐시에서 복사 ───────────────────────────────────────────
if os.path.exists(BASE_MODEL_DIR) and os.path.isdir(BASE_MODEL_DIR):
    # 실제 모델 파일들이 있는지 확인
    model_files = [f for f in os.listdir(BASE_MODEL_DIR) if f.endswith('.safetensors')]
    if model_files:
        logger.info(f"Base model already exists locally with model files: {model_files}")
        logger.info("Using existing local model.")
        use_existing_model = True
    else:
        logger.info("Base model directory exists but no model files found.")
        use_existing_model = False
else:
    logger.info(f"Base model not found locally.")
    use_existing_model = False

if not use_existing_model:
    # 캐시에서 모델 찾기
    cached_model_dir = find_cached_model()
    if cached_model_dir:
        logger.info("Found cached model, copying to local directory...")
        if copy_cached_model_to_local(cached_model_dir, BASE_MODEL_DIR):
            logger.info("Successfully copied cached model to local directory.")
        else:
            logger.error("Failed to copy cached model.")
            # 캐시 복사 실패 시 Hugging Face에서 직접 로드
            logger.info("Falling back to direct loading from Hugging Face...")
            tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False, token=hf_auth_token)
            model_path = BASE_MODEL
    else:
        logger.info("No cached model found. Loading directly from Hugging Face...")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False, token=hf_auth_token)
        model_path = BASE_MODEL

# ── 4. 토크나이저 로드 ───────────────────────────────────────────
if os.path.exists(BASE_MODEL_DIR):
    # 토크나이저 파일이 존재하는지 확인
    tokenizer_files = [f for f in os.listdir(BASE_MODEL_DIR) if 'tokenizer' in f.lower() or 'special_tokens' in f.lower()]
    if tokenizer_files:
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_DIR, use_fast=False)
        model_path = BASE_MODEL_DIR
        logger.info("Tokenizer loaded from local directory.")
    else:
        logger.warning("Tokenizer files not found in local directory. Downloading from HuggingFace...")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False, token=hf_auth_token)
        # 토크나이저를 로컬에 저장
        tokenizer.save_pretrained(BASE_MODEL_DIR)
        logger.info("Tokenizer downloaded and saved to local directory.")
        model_path = BASE_MODEL_DIR
else:
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False, token=hf_auth_token)
    model_path = BASE_MODEL
    logger.info("Tokenizer loaded from Hugging Face.")

tokenizer.pad_token = tokenizer.eos_token

# ── 5. LoRA용 양자화된 베이스 모델 로드 (어댑터 생성용) ───────────────────────────────────────────
logger.info("Loading quantized base model for LoRA adapter creation...")

# 4bit 양자화 옵션 (RTX 2080 8GB VRAM에 최적화)
bnb_cfg = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

base = AutoModelForCausalLM.from_pretrained(
    model_path,
    quantization_config=bnb_cfg,
    device_map="auto",
    torch_dtype=torch.float16,
    trust_remote_code=True,
    token=hf_auth_token if model_path == BASE_MODEL else None
)
logger.info(f"Quantized base model loaded from: {model_path}")

# ── 6. LoRA 어댑터 초기화 ───────────────────────────────────────────
lora_cfg = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    # Llama 3 모델에 권장되는 target_modules
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
)
model = get_peft_model(base, lora_cfg)
logger.info("LoRA adapter initialized.")

# PEFT 모델의 학습 가능 파라미터 확인
model.print_trainable_parameters()

# ── 7. 어댑터와 토크나이저 저장 ───────────────────────────────────────────
os.makedirs(INIT_DIR, exist_ok=True)
model.save_pretrained(INIT_DIR, safe_serialization=True)
tokenizer.save_pretrained(INIT_DIR)

logger.info(f"Empty LoRA adapter successfully created and saved to: `{INIT_DIR}`")
logger.info(f"Base model location: `{model_path}`")

# 저장된 파일 확인
try:
    if os.path.exists(BASE_MODEL_DIR):
        base_files = os.listdir(BASE_MODEL_DIR)
        logger.info(f"Base model files: {base_files}")
    
    adapter_files = os.listdir(INIT_DIR)
    logger.info(f"Adapter files: {adapter_files}")
except Exception as e:
    logger.warning(f"Could not list files: {e}")

logger.info("All models are now available locally for fast loading!")