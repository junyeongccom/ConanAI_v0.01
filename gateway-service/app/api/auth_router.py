# app/api/auth_router.py
from fastapi import APIRouter

router = APIRouter(prefix="/auth")

@router.post("/token")
async def hello_world():
    return {"message": "Hello World"}
