from fastapi import FastAPI
import os
from dotenv import load_dotenv
from app.api.stocktrend_router import router
from icecream import ic
from starlette.middleware.cors import CORSMiddleware

# Get the project root directory (one level up from the current file)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = FastAPI(
    title="Stocktrend Service",
    description="Stock trend analysis service",
    version="1.0.0"
)

# CORS 설정
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router 연결
app.include_router(router, prefix="/api/stocktrend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)