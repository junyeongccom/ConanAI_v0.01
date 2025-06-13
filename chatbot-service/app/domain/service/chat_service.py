import os
import re # URL 제거를 위해 re 모듈 추가
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, GenerationConfig
import torch
from starlette.concurrency import run_in_threadpool # 비동기 처리를 위해 필요


# .env 파일 로드
load_dotenv()

class ChatService:
    def __init__(self):
        self.model_name = "junyeongc/tcfd-slm-finetuned-polyglot-ko-1.3b-250612"
        self.hf_auth_token = os.getenv("HUGGINGFACE_AUTH_TOKEN")
        self.tokenizer = None
        self.model = None
        self.pipe = None
        self._load_model() # 서비스 인스턴스 생성 시 모델 로드

    def _load_model(self):
        """
        Hugging Face 모델을 로드합니다.
        모델 로드는 시간이 오래 걸리므로, 애플리케이션 시작 시 한 번만 수행하는 것이 효율적입니다.
        """
        print(f"Loading model: {self.model_name}...")
        try:
            from peft import PeftModel, PeftConfig

            peft_config = PeftConfig.from_pretrained(self.model_name, token=self.hf_auth_token)
            base_model_name = peft_config.base_model_name_or_path

            self.tokenizer = AutoTokenizer.from_pretrained(base_model_name, token=self.hf_auth_token)
            self.model = AutoModelForCausalLM.from_pretrained(
                base_model_name,
                token=self.hf_auth_token,
                torch_dtype=torch.float16,
                device_map="auto"
            )
            self.model = PeftModel.from_pretrained(self.model, self.model_name, token=self.hf_auth_token)
            self.model.eval()

            self.pipe = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
            )
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise RuntimeError(f"Failed to load Hugging Face model: {e}")

    def _generate_text(self, prompt: str):
        """
        pipeline을 사용하여 텍스트를 생성하는 동기 함수.
        run_in_threadpool로 감싸서 비동기적으로 호출됩니다.
        """
        bad_words_list = ["http", "https", ".com", ".org", "www", "html", "php", "co.kr", "작성자", "출처"] # '작성자', '출처' 추가
        bad_words_ids = [self.tokenizer.encode(word, add_special_tokens=False) for word in bad_words_list]
        bad_words_ids = [ids for ids in bad_words_ids if ids]

        gen_config = GenerationConfig(
            max_new_tokens=200,
            num_return_sequences=1,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
            repetition_penalty=1.2,
            pad_token_id=self.tokenizer.eos_token_id,
            bad_words_ids=bad_words_ids,
            # no_repeat_ngram_size=3,
        )

        return self.pipe(
            prompt,
            generation_config=gen_config,
        )

    async def get_response_from_model(self, user_message: str) -> str:
        """
        사용자 메시지를 받아 Hugging Face 모델로부터 응답을 생성하고 후처리합니다.
        """
        if not self.pipe:
            raise RuntimeError("Model is not loaded. Cannot generate response.")

        prompt = f"사용자: {user_message}\n챗봇:"

        generated_text = await run_in_threadpool(self._generate_text, prompt)

        if generated_text and len(generated_text) > 0:
            response_text = generated_text[0]['generated_text']

            # 1. 프롬프트 부분 제거
            if response_text.startswith(prompt):
                response_text = response_text[len(prompt):].strip()
            # 2. 다음 턴의 사용자 메시지 시작 부분 제거 (모델이 추가 생성을 할 경우)
            if "사용자:" in response_text:
                response_text = response_text.split("사용자:")[0].strip()

            # --- 3. 후처리: 불필요한 패턴 제거 ---

            # 3-1. URL 제거
            # 웹 URL 패턴
            url_pattern = r'https?://(?:www\.)?\S+\.(?:com|org|net|gov|edu|co\.kr|jp|html|pdf|txt|php|asp|htm|xml|xlsx|docx|zip|rar)(?:\S*)?'
            response_text = re.sub(url_pattern, '', response_text).strip()

            # 3-2. [출처] 및 |작성자 패턴 제거 (여러 줄에 걸쳐 발생할 수 있는 경우도 고려)
            # 예시: [출처] 본 기사는 ...입니다.|작성자 SDRC
            #       [출처] ...
            #       |작성자 ...
            source_author_pattern = r'\[출처\].*?\|작성자\s*\S+|\[출처\].*?|\|작성자\s*\S+'
            # re.DOTALL을 사용하여 .이 줄바꿈 문자도 포함하도록 합니다.
            response_text = re.sub(source_author_pattern, '', response_text, flags=re.DOTALL).strip()

            # 3-3. HTML 태그 제거 (예: &quot;와 같은 HTML 엔티티를 일반 따옴표로 변환 후 제거)
            # 먼저 HTML 엔티티 디코딩 (선택 사항이지만, 깔끔한 처리를 위해 권장)
            # from html import unescape # 필요하다면 추가 import
            # response_text = unescape(response_text)
            # HTML 태그 제거 (예: <a href=...> 같은 경우)
            # 이 경우에는 `&quot;` (따옴표)가 보이므로, HTML 엔티티 제거도 고려.
            # &quot;는 ' 따옴표 ' 로 보이게 하고 싶다면 unescape() 사용.
            # 하지만 현재 패턴이 명확하므로, 일단 특정 패턴 제거에 집중.
            response_text = response_text.replace('&quot;', '"') # HTML &quot;를 실제 "로 변환

            # 3-4. 불필요한 공백, 연속된 구두점 정리 강화
            response_text = re.sub(r'\s{2,}', ' ', response_text).strip() # 연속된 공백을 단일 공백으로
            response_text = re.sub(r'([.,!?;])\s*\1+', r'\1', response_text) # 연속된 . , ! ? ; 제거 (예: .. -> ., ,,, -> ,)
            response_text = re.sub(r'\s*([.,!?;])', r'\1', response_text) # 구두점 앞 공백 제거
            response_text = re.sub(r'([.,!?;])\s*([가-힣a-zA-Z0-9])', r'\1 \2', response_text) # 구두점 뒤에 공백이 없으면 추가

            return response_text
        return "죄송합니다. 응답을 생성하지 못했습니다."