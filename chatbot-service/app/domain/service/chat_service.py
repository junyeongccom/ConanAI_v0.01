import os
from transformers import AutoTokenizer, AutoModelForCausalLM

class ChatService:
    def __init__(self):
        token = os.getenv("HUGGINGFACE_TOKEN")
        self.tokenizer = AutoTokenizer.from_pretrained("lcw99/ko-dialoGPT-korean-chit-chat", token=token)
        self.model = AutoModelForCausalLM.from_pretrained("lcw99/ko-dialoGPT-korean-chit-chat", token=token)

    def get_response(self, message: str) -> str:
        inputs = self.tokenizer.encode(message + self.tokenizer.eos_token, return_tensors="pt")
        outputs = self.model.generate(
            inputs,
            max_length=50,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=self.tokenizer.eos_token_id
        )
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response 