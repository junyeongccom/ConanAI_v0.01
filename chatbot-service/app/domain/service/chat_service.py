import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from typing import Dict, Any

class ChatService:
    def __init__(self):
        # SLM 모델 경로 설정
        self.FINAL_ADAPTER_PATH = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "platform", 
            "TCFD-SLM-250610", "tcfd-slm-finetuned-polyglot-1.3b-dataset-b"
        ))
        self.BASE_MODEL_NAME = "EleutherAI/polyglot-ko-1.3b"
        
        # GPU 사용 가능 여부 확인 및 안전한 설정
        self.use_gpu = False
        self.device = "cpu"
        
        if torch.cuda.is_available():
            try:
                # bitsandbytes 라이브러리 테스트
                from transformers import BitsAndBytesConfig
                self.use_gpu = True
                self.device = "cuda"
                print(f"GPU 사용 가능: {torch.cuda.get_device_name(0)}")
            except Exception as e:
                print(f"GPU 사용 불가 (bitsandbytes 오류): {str(e)}")
                print("CPU 모드로 폴백합니다.")
                self.use_gpu = False
                self.device = "cpu"
        else:
            print("CUDA를 사용할 수 없습니다. CPU 모드를 사용합니다.")
        
        print(f"사용 중인 디바이스: {self.device}")
        
        try:
            # 토크나이저 로드
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.BASE_MODEL_NAME, 
                use_fast=False
            )
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
            if self.use_gpu:
                # GPU 환경: 4-bit 양자화 사용
                from transformers import BitsAndBytesConfig
                bnb_cfg = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
                
                base_model = AutoModelForCausalLM.from_pretrained(
                    self.BASE_MODEL_NAME,
                    quantization_config=bnb_cfg,
                    device_map="auto",
                    torch_dtype=torch.float16
                )
            else:
                # CPU 환경: 일반 로딩
                base_model = AutoModelForCausalLM.from_pretrained(
                    self.BASE_MODEL_NAME,
                    torch_dtype=torch.float32,
                    device_map="cpu"
                )
            
            # LoRA 어댑터 연결
            self.model = PeftModel.from_pretrained(base_model, self.FINAL_ADAPTER_PATH)
            self.model.eval()
            
            print("SLM 모델 로드 완료!")
            
        except Exception as e:
            print(f"모델 로드 실패: {str(e)}")
            raise RuntimeError(f"SLM 모델 로드에 실패했습니다: {str(e)}")

    async def generate_response(self, chat_request: Dict[str, Any]) -> str:
        user_input = chat_request.get("message", "")
        
        # 프롬프트 형식 변경
        prompt = f"### 질문:\n{user_input}\n### 답변:\n"
        
        # 입력 토큰화
        inputs = self.tokenizer(
            prompt, 
            return_tensors="pt", 
            padding=True, 
            truncation=True
        )
        
        # GPU 사용 시 입력을 GPU로 이동
        if self.use_gpu:
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # token_type_ids 제거
        if 'token_type_ids' in inputs:
            del inputs['token_type_ids']
        
        # 생성 파라미터 조정
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.8,
                repetition_penalty=1.2,
                top_p=0.9,
                do_sample=True,
                eos_token_id=self.tokenizer.eos_token_id,
                pad_token_id=self.tokenizer.pad_token_id
            )
        
        # 응답 디코딩
        response = self.tokenizer.decode(
            outputs[0][inputs['input_ids'].shape[1]:], 
            skip_special_tokens=True
        )
        
        return response.strip()

    def get_response(self, message: str) -> str:
        """기존 동기 메서드와의 호환성을 위한 래퍼 메서드"""
        import asyncio
        chat_request = {"message": message}
        return asyncio.run(self.generate_response(chat_request)) 