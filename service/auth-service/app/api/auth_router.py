# 인증 관련 API 라우터 - 라우팅 책임만 담당
from fastapi import APIRouter, Depends, Query, Form, Header, Response, Request
from sqlalchemy.orm import Session
from typing import Optional
import os

from app.domain.controller.auth_controller import AuthController
from app.domain.model.auth_schema import Token, HealthResponse, AuthCallbackResponse
from app.foundation.database import get_db
from app.foundation.dependencies import get_auth_controller

# APIRouter 인스턴스 생성
router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# 의존성 주입은 foundation/dependencies.py에서 중앙 관리
# 응답 모델은 domain/model/user_schema.py에서 정의

# 엔드포인트 정의
@router.get("/health", response_model=HealthResponse)
async def health_check(controller: AuthController = Depends(get_auth_controller)):
    """서비스 상태 확인 엔드포인트"""
    return controller.health_check()

@router.get("/google/login")
async def google_login(controller: AuthController = Depends(get_auth_controller)):
    """Google OAuth 로그인을 시작합니다."""
    return controller.google_login()

@router.get("/google/callback")
async def google_callback_get(
    response: Response,
    code: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    controller: AuthController = Depends(get_auth_controller)
):
    """Google OAuth 콜백 처리 (GET 방식) - HttpOnly 쿠키 설정 및 JSON 응답"""
    
    # Google OAuth에서 오류가 발생한 경우
    if error:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google OAuth 오류: {error}"
        )
    
    # 인증 코드가 없는 경우
    if not code:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="authorization code가 없습니다."
        )
    
    # 컨트롤러에 Response 객체를 전달하여 토큰 생성 및 쿠키 설정
    return await controller.google_callback(response, db, code)

@router.post("/google/callback", response_model=Token)
async def google_callback_post(
    id_token: str = Form(...),
    db: Session = Depends(get_db),
    controller: AuthController = Depends(get_auth_controller)
):
    """Google OAuth 콜백 처리 (POST 방식)"""
    return await controller.google_callback_post(db, id_token)

@router.post("/verify")
async def verify_token(
    token: str = Form(...),
    controller: AuthController = Depends(get_auth_controller)
):
    """JWT 토큰 검증"""
    return controller.verify_token(token)

@router.get("/me")
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    controller: AuthController = Depends(get_auth_controller)
):
    """현재 사용자 정보 조회 (HttpOnly 쿠키 기반)"""
    # 쿠키에서 토큰 추출
    token = request.cookies.get("access_token")
    
    if not token:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 없습니다."
        )
    
    return controller.get_current_user(db, token)

@router.post("/logout")
async def logout(
    response: Response,
    request: Request,
    controller: AuthController = Depends(get_auth_controller)
):
    """로그아웃 처리 - JWT 토큰을 블랙리스트에 추가하고 쿠키 삭제"""
    # 쿠키에서 토큰 추출
    token = request.cookies.get("access_token")
    
    if not token:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 없습니다."
        )
    
    try:
        # 컨트롤러에 Response 객체를 전달하여 로그아웃 처리 및 쿠키 삭제
        return await controller.logout(response, token)
        
    except Exception as e:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="로그아웃 처리 중 오류가 발생했습니다."
        )

@router.post("/verify-with-blacklist")
async def verify_token_with_blacklist(
    authorization: str = Header(..., description="Bearer token"),
    controller: AuthController = Depends(get_auth_controller)
):
    """JWT 토큰 검증 (블랙리스트 확인 포함)"""
    # Authorization 헤더에서 토큰 추출
    if not authorization.startswith("Bearer "):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 Authorization 헤더 형식입니다. 'Bearer <token>' 형식이어야 합니다."
        )
    
    token = authorization.split(" ")[1]
    return await controller.verify_token_with_blacklist(token) 