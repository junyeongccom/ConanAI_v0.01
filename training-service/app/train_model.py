# app/train_model.py

import os, glob, json, warnings, torch
from datasets import Dataset, concatenate_datasets
from transformers import AutoTokenizer, AutoModelForCausalLM, DataCollatorForLanguageModeling, Trainer
from peft import PeftModel, get_peft_model
from dotenv import load_dotenv # .env 파일 로드
import structlog # 로깅을 위해 추가

# 설정 파일 임포트
from app.configs.model_config import BASE_MODEL_NAME, INITIAL_ADAPTER_PATH, TRAINED_ADAPTER_OUTPUT_DIR, BNB_CONFIG, LORA_CONFIG
from app.configs.training_config import TRAINING_ARGS
from app.data_preprocessing import clean_text_for_training # 데이터 정제 함수 임포트

# ── 0. 환경 설정 및 로깅 설정 ───────────────────────────────────────────
load_dotenv() # .env 파일에서 환경 변수 로드
os.environ["WANDB_DISABLED"] = "true"
warnings.filterwarnings("ignore")

# structlog 로거 설정
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer() # 개발 환경에서 콘솔 출력용
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logger = structlog.get_logger(__name__)

if torch.cuda.is_available():
    torch.cuda.empty_cache()
    logger.info("GPU cache memory successfully cleared.")
else:
    logger.warning("GPU not available, skipping cache memory clear.")

# ── 1. 모델·토크나이저·LoRA 설정 ───────────────────────────────────────────
# 로컬에 저장된 베이스 모델 경로
BASE_MODEL_DIR = "/app/models/base_model/llama3-korean-bllossom-8b"

# Hugging Face 인증 토큰 사용
HF_AUTH_TOKEN = os.getenv("HUGGINGFACE_AUTH_TOKEN")
if not HF_AUTH_TOKEN:
    logger.error("HUGGINGFACE_AUTH_TOKEN 환경 변수가 설정되지 않았습니다. .env 파일에 설정해주세요.")
    raise ValueError("HUGGINGFACE_AUTH_TOKEN이 모델 로드에 필요합니다.")

# 토크나이저 로드 (로컬 우선, 없으면 Hugging Face)
if os.path.exists(BASE_MODEL_DIR) and os.path.isdir(BASE_MODEL_DIR):
    logger.info(f"로컬 디렉토리에서 토크나이저 로드 중: {BASE_MODEL_DIR}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_DIR, use_fast=False)
    logger.info("로컬에서 토크나이저 로드 완료.")
else:
    logger.info(f"로컬에 베이스 모델이 없어 Hugging Face에서 토크나이저 로드 중: {BASE_MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME, use_fast=False, token=HF_AUTH_TOKEN)
    logger.info("Hugging Face에서 토크나이저 로드 완료.")

tokenizer.pad_token = tokenizer.eos_token

# 베이스 모델 로드 (로컬 우선, 없으면 Hugging Face)
if os.path.exists(BASE_MODEL_DIR) and os.path.isdir(BASE_MODEL_DIR):
    logger.info(f"로컬 디렉토리에서 베이스 모델 로드 중 (4bit 양자화): {BASE_MODEL_DIR}")
    try:
        base = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_DIR,
            quantization_config=BNB_CONFIG,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
        )
        logger.info("로컬에서 베이스 모델 로드 완료.")
    except Exception as e:
        logger.error(f"로컬 베이스 모델 로드 중 오류 발생: {e}. Hugging Face에서 다운로드를 시도합니다.")
        base = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_NAME,
            quantization_config=BNB_CONFIG,
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
        base = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_NAME,
            quantization_config=BNB_CONFIG,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
            token=HF_AUTH_TOKEN
        )
        logger.info("Hugging Face에서 베이스 모델 로드 완료.")
    except Exception as e:
        logger.error(f"베이스 모델 로드 중 오류 발생: {e}. BitsAndBytes 설정 또는 GPU 메모리를 확인해주세요.")
        raise

# 새로 생성한 빈 LoRA 어댑터 로드 또는 생성 (여기서는 항상 로드)
if os.path.exists(INITIAL_ADAPTER_PATH) and os.path.isdir(INITIAL_ADAPTER_PATH):
    model = PeftModel.from_pretrained(base, INITIAL_ADAPTER_PATH)
    logger.info(f"Initial LoRA adapter loaded from: {INITIAL_ADAPTER_PATH}")
else:
    # 이 부분은 generate_initial_adapter.py를 먼저 실행하여 빈 어댑터를 생성했어야 함.
    # 만약 빈 어댑터가 없다면 에러 발생 또는 새로 생성 (여기서는 에러를 가정)
    logger.error(f"Initial LoRA adapter not found at '{INITIAL_ADAPTER_PATH}'. Please ensure it's generated.")
    raise FileNotFoundError(f"Initial LoRA adapter not found at {INITIAL_ADAPTER_PATH}")


model.train()
model.config.use_cache = False # 학습 중에는 캐시 비활성화
try:
    model.gradient_checkpointing_disable()
except:
    pass
# trainable_parameters = model.print_trainable_parameters() # 이전 코드에서 print_trainable_parameters()는 반환값이 없습니다.
logger.info("Model set to training mode and cache disabled.")
# PEFT 모델의 학습 가능 파라미터는 get_peft_model에서 설정되므로 여기서 다시 설정할 필요는 없습니다.
# for n,p in model.named_parameters():
#     p.requires_grad = ("lora_" in n) or ("embed_tokens" in n)

# ── 2. 데이터 불러오기 및 전처리 ───────────────────────────────────────────
all_data_files = []
# 훈련 데이터를 컨테이너 내부의 /app/data/knowledge/250612-1 경로에서 로드
specific_knowledge_folders = [
    "/app/data/knowledge/250612-1", # 컨테이너 내부 경로로 지정
    # 필요시 다른 폴더 추가
]

for folder_path in specific_knowledge_folders:
    all_data_files.extend(glob.glob(os.path.join(folder_path, "*.jsonl")))

if not all_data_files:
    logger.error("No .jsonl files found in the specified data paths. Please check the paths and data presence.")
    raise FileNotFoundError("No training data files found.")
logger.info(f"Loading {len(all_data_files)} .jsonl files...")

list_of_datasets = []
for path in all_data_files:
    current_examples = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    if ('instruction' in data or 'input' in data) and 'output' in data:
                        # 데이터 정제 함수 적용
                        cleaned_input = clean_text_for_training(data.get('instruction', data.get('input')))
                        cleaned_output = clean_text_for_training(data['output'])

                        if not cleaned_input or not cleaned_output:
                            logger.warning(f"Skipping empty sample after cleaning (File: {path}, Line: {line[:50]}...)")
                            continue

                        current_examples.append({"input": cleaned_input, "output": cleaned_output})
                    else:
                        logger.warning(f"Missing required keys ('input'/'instruction' or 'output') in JSON object (File: {path}, Line: {line[:50]}...)")
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decoding error: {e} (File: {path}, Line: {line[:50]}...)")
                    continue
    except Exception as e:
        logger.error(f"Unexpected error loading file: {e} (File: {path})")
        continue

    if current_examples:
        list_of_datasets.append(Dataset.from_list(current_examples))
        logger.info(f"Loaded {len(current_examples)} samples from '{path}'.")
    else:
        logger.warning(f"No valid samples found in '{path}'.")

if not list_of_datasets:
    logger.error("No valid datasets found to start training.")
    raise ValueError("No valid training dataset.")

raw_dataset = concatenate_datasets(list_of_datasets)
logger.info(f"Total samples loaded: {len(raw_dataset)}")

def preprocess(ex):
    input_text = ex['input']
    prompt = f"### 질문:\n{input_text}\n### 답변:\n"
    full   = prompt + ex["output"] + tokenizer.eos_token
    enc    = tokenizer(full, truncation=True, max_length=512)

    plen   = len(tokenizer(prompt, truncation=True, max_length=512).input_ids)
    labels = [-100] * plen + enc.input_ids[plen:]

    return {
        "input_ids":       enc.input_ids,
        "attention_mask":  enc.attention_mask,
        "labels":          labels,
    }
ds = raw_dataset.map(preprocess, remove_columns=raw_dataset.column_names, batched=False)
collator = DataCollatorForLanguageModeling(tokenizer, mlm=False)

# ── 3. Trainer 세팅 ─────────────────────────────────────────────────────────
# TrainingArguments에 output_dir을 설정
TRAINING_ARGS.output_dir = TRAINED_ADAPTER_OUTPUT_DIR
args = TRAINING_ARGS

trainer = Trainer(
    model           = model,
    args            = args,
    train_dataset   = ds,
    data_collator   = collator,
)

# ── 4. 학습 & 저장 ─────────────────────────────────────────────────────────
logger.info(f"Starting Fine-tuning with 'TCFD Knowledge Injection' dataset. Results will be saved to '{TRAINED_ADAPTER_OUTPUT_DIR}'...")
trainer.train()
os.makedirs(TRAINED_ADAPTER_OUTPUT_DIR, exist_ok=True)
model.save_pretrained(TRAINED_ADAPTER_OUTPUT_DIR, safe_serialization=True)
tokenizer.save_pretrained(TRAINED_ADAPTER_OUTPUT_DIR)
logger.info(f"TCFD Knowledge Injection Fine-tuning completed → {TRAINED_ADAPTER_OUTPUT_DIR}")