from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.xbrl_parser_router import router as xbrl_parser_router
from app.api.opendart_router import router as opendart_router
from app.api.dsdgen_router import router as dsdgen_router
from app.api.dsd_auto_fetch_router import router as dsd_auto_fetch_router
from app.api.xsldsd_router import router as xsldsd_router

load_dotenv()
app = FastAPI()

# CORS 설정###
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://conan.ai.kr"],  # Next.js 개발 서버
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 라우터에 이미 prefix가 설정되어 있으므로 추가 prefix 없이 등록
app.include_router(xbrl_parser_router)
app.include_router(opendart_router)
app.include_router(dsdgen_router)
app.include_router(dsd_auto_fetch_router)
app.include_router(xsldsd_router, prefix="/dsdgen")


@app.get("/")
def read_root():
    return {"Hello": "World"}
