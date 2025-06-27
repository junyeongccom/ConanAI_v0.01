# 인증 관련 컨트롤러 - 요청/응답 처리 계층
from fastapi import HTTPException, status, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

from app.domain.service.auth_service import AuthService
from app.domain.model.auth_schema import Token, AuthCallbackResponse, AuthCallbackUser

load_dotenv()

class AuthController:
    """인증 관련 HTTP 요청/응답 처리를 담당하는 컨트롤러"""
    
    def __init__(self, auth_service: AuthService = None):
        self.auth_service = auth_service or AuthService()
    
    def google_login(self):
        """Google OAuth 로그인 시작"""
        try:
            google_auth_url = self.auth_service.generate_google_oauth_url()
            return RedirectResponse(url=google_auth_url, status_code=302)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
    
    async def google_callback(self, response: Response, db: Session, code: str):
        """Google OAuth 콜백 처리 (GET 방식) - HttpOnly 쿠키 설정 및 JSON 응답"""
        
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="authorization code가 없습니다."
            )
        
        try:
            # authorization code를 사용해서 토큰 및 사용자 정보 획득
            token_data = await self.auth_service.handle_google_oauth_callback(db, code)
            
            if not token_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Google 인증에 실패했습니다."
                )
            
            # 1. 리다이렉트 응답 생성
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
            redirect_response = RedirectResponse(
                url=f"{frontend_url}/",  # 메인페이지로 리다이렉트
                status_code=302
            )
            
            # 2. 리다이렉트 응답에 HttpOnly 쿠키 설정 (가장 중요!)
            redirect_response.set_cookie(
                key="access_token",
                value=token_data.access_token,
                httponly=True,
                samesite="lax",  # cross-site redirect 후 쿠키 사용을 위해 'lax'가 더 안전
                path="/",
                secure=True if os.getenv("ENVIRONMENT") == "production" else False,
                max_age=7 * 24 * 60 * 60  # 7일
            )
            
            print(f"🍪 쿠키 설정 완료: access_token (길이: {len(token_data.access_token)})")
            print(f"🔄 리다이렉트 대상: {frontend_url}/")
            
            return redirect_response
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"Google OAuth 콜백 처리 오류: {e}")
            # 에러 발생 시에도 JSON으로 응답
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"콜백 처리 중 서버 오류 발생: {str(e)}"
            )
    
    async def google_callback_post(self, db: Session, id_token: str) -> Token:
        """Google OAuth 콜백 처리 (POST 방식)"""
        # 이 메서드는 기존 호환성을 위해 유지하지만, 실제로는 사용되지 않을 것 같습니다.
        # 필요에 따라 구현하거나 제거할 수 있습니다.
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="POST 방식 Google 콜백은 현재 지원되지 않습니다."
        )
    
    async def logout(self, response: Response, token: str) -> Dict[str, Any]:
        """로그아웃 처리 - JWT 토큰을 블랙리스트에 추가하고 쿠키 삭제"""
        try:
            # 블랙리스트에 토큰 추가
            result = await self.auth_service.logout_and_blacklist_token(token)
            
            # 쿠키 삭제
            response.delete_cookie(
                key="access_token",
                path="/",
                samesite="strict"
            )
            
            return result
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="로그아웃 처리 중 서버 오류가 발생했습니다."
            )
    
    async def verify_token_with_blacklist(self, token: str) -> Dict[str, Any]:
        """JWT 토큰 검증 (블랙리스트 확인 포함)"""
        try:
            payload = await self.auth_service.verify_token_with_blacklist_check(token)
            
            if not payload:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="유효하지 않거나 블랙리스트에 등록된 토큰입니다."
                )
            
            return {
                "valid": True,
                "user_id": payload.get("sub"),
                "email": payload.get("email"),
                "username": payload.get("username"),
                "jti": payload.get("jti"),
                "exp": payload.get("exp")
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="토큰 검증 중 서버 오류가 발생했습니다."
            )
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """JWT 토큰 검증 (기본)"""
        try:
            payload = self.auth_service.verify_token(token)
            
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
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="토큰 검증 중 서버 오류가 발생했습니다."
            )
    
    def get_current_user(self, db: Session, token: str) -> Dict[str, Any]:
        """현재 사용자 정보 조회"""
        try:
            # 토큰 검증
            payload = self.auth_service.verify_token(token)
            
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
            user = self.auth_service.get_user_by_id(db, user_id)
            
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
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="사용자 정보 조회 중 오류가 발생했습니다."
            )
    
    def health_check(self) -> Dict[str, str]:
        """서비스 상태 확인"""
        return {
            "message": "Hello World from auth-service",
            "status": "healthy"
        } 