from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.domain.controller.esgdsd_controller import ESGDSDController
from app.domain.model.esgdsd_schema import ChatRequest, ChatResponse
from typing import Dict, Any
import os
import openai
from dotenv import load_dotenv
from fastapi.concurrency import run_in_threadpool
from openai import OpenAI

router = APIRouter()
controller = ESGDSDController()

# .env에서 OpenAI 키 로드
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/hello")
async def hello_world():
    return {"message": "Hello from ESG DSD Service!"}

@router.post("/extract")
async def extract_text(
    file: UploadFile = File(...),
    page_num: int = Form(...),
) -> Dict[str, Any]:
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        if page_num < 1:
            raise HTTPException(status_code=400, detail="Page number must be greater than 0")
        return await controller.extract_text(file, page_num)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat_with_openai(req: ChatRequest):
    try:
        def sync_chat():
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "당신은 공시 보고서에 대해 도움을 주는 전문가입니다."},
                    {"role": "user", "content": req.question}
                ],
                temperature=0.1,
                max_tokens=1024
            )
            return response.choices[0].message.content

        answer = await run_in_threadpool(sync_chat)
        return ChatResponse(answer=answer)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 호출 오류: {str(e)}")