# 인증 관련 API 라우터 
from fastapi import APIRouter, Depends, HTTPException, status, Query, Form
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel

from app.domain.service.auth_service import AuthService
from app.domain.model.user_schema import Token
from app.foundation.database import get_db

load_dotenv()

# APIRouter 인스턴스 생성
router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

auth_service = AuthService()

# 응답 모델 정의
class HealthResponse(BaseModel):
    message: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: Hello World 메시지
    """
    return {"message": "Hello World from auth-service", "status": "healthy"}

@router.get("/google/login")
async def google_login():
    """
    Google OAuth 로그인을 시작합니다.
    Google OAuth 인증 서버로 사용자를 리다이렉트합니다.
    """
    # Google OAuth 설정
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")
    
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID가 설정되지 않았습니다."
        )
    
    # Google OAuth 인증 URL 생성
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&scope=openid email profile"
        f"&response_type=code"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    
    return RedirectResponse(url=google_auth_url, status_code=302)

@router.post("/google/callback", response_model=Token)
async def google_callback(
    id_token: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Google OAuth 콜백 처리
    - Google에서 받은 ID Token을 검증
    - 사용자 정보 추출 및 자동 회원가입/로그인
    - JWT 액세스 토큰 발급
    """
    token = await auth_service.handle_google_callback(db, id_token)
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google 인증에 실패했습니다."
        )
    
    return token

@router.get("/google/callback")
async def google_callback_get(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Google OAuth 콜백 처리 (GET 방식)
    Google에서 authorization code를 받아 처리하고 프론트엔드로 리다이렉트
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # 에러가 있는 경우
    if error:
        return RedirectResponse(url=f"{frontend_url}/auth/error?message={error}")
    
    # authorization code가 없는 경우
    if not code:
        return RedirectResponse(url=f"{frontend_url}/auth/error?message=missing_code")
    
    try:
        # authorization code를 사용해서 토큰 발급
        token = await auth_service.handle_google_oauth_callback(db, code)
        
        if not token:
            return RedirectResponse(url=f"{frontend_url}/auth/error?message=auth_failed")
        
        # 프론트엔드 성공 페이지로 토큰과 함께 리다이렉트
        redirect_url = f"{frontend_url}/auth/success?token={token.access_token}"
        print(f"🔄 리다이렉트 URL 생성: {redirect_url}")
        
        redirect_response = RedirectResponse(
            url=redirect_url,
            status_code=302
        )
        
        # 디버깅: 응답 헤더 확인
        print(f"🔍 RedirectResponse 헤더: {redirect_response.headers}")
        print(f"🔍 RedirectResponse 상태 코드: {redirect_response.status_code}")
        
        return redirect_response
        
    except Exception as e:
        print(f"Google OAuth 콜백 처리 오류: {e}")
        return RedirectResponse(url=f"{frontend_url}/auth/error?message=server_error")

@router.post("/verify")
async def verify_token(token: str = Form(...)):
    """
    JWT 토큰 검증
    """
    payload = auth_service.verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )
    
    return {
        "valid": True,
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "username": payload.get("username")
    }

@router.get("/me")
async def get_current_user(
    token: str = Query(..., description="JWT access token"),
    db: Session = Depends(get_db)
):
    """
    현재 사용자 정보 조회
    """
    payload = auth_service.verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰에서 사용자 ID를 찾을 수 없습니다."
        )
    
    # 사용자 정보 조회
    try:
        from uuid import UUID
        user = auth_service.user_repository.get_user_by_google_id(db, user_id)
        
        if not user:
            # user_id가 UUID 형태일 수도 있으므로 직접 조회
            from app.domain.model.user_entity import User
            user = db.query(User).filter(User.user_id == UUID(user_id)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다."
            )
        
        return {
            "user_id": str(user.user_id),
            "email": user.email,
            "username": user.username,
            "company_name": user.company_name,
            "industry_type": user.industry_type,
            "created_at": user.created_at,
            "last_login_at": user.last_login_at
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="사용자 정보 조회 중 오류가 발생했습니다."
        ) 