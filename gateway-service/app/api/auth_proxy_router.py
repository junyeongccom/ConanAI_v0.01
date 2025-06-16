"""
Google OAuth 프록시 라우터
auth-service로의 Google OAuth 요청을 프록시하는 라우터
"""
import os
import logging
import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 로거 설정
logger = logging.getLogger("gateway-api")

# 환경 변수
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8084")

# APIRouter 인스턴스 생성
auth_proxy_router = APIRouter(tags=["Auth Proxy"])

@auth_proxy_router.get("/google/login", summary="Google 로그인 시작")
async def google_login(request: Request):
    """Google OAuth 로그인을 시작합니다."""
    try:
        async with httpx.AsyncClient() as client:
            # 쿼리 파라미터 전달
            params = dict(request.query_params)
            
            logger.info(f"🔄 auth-service로 로그인 요청 전달: {params}")
            
            response = await client.get(
                f"{AUTH_SERVICE_URL}/auth/google/login",
                params=params,
                follow_redirects=False
            )
            
            logger.info(f"📡 auth-service 응답 상태: {response.status_code}")
            logger.info(f"📡 auth-service 응답 헤더: {dict(response.headers)}")
            
            if response.status_code in [301, 302, 303, 307, 308]:
                # 리다이렉트 응답인 경우
                location = response.headers.get("location")
                logger.info(f"🔍 Location 헤더 값: {location}")
                
                if location:
                    # auth-service의 리다이렉트 응답을 그대로 전달
                    from fastapi import Response
                    redirect_response = Response(
                        status_code=response.status_code,
                        headers={"Location": location}
                    )
                    logger.info(f"✅ 리다이렉트 응답 생성 완료: {location}")
                    return redirect_response
                else:
                    logger.error("❌ Location 헤더가 없는 리다이렉트 응답")
                    return JSONResponse(
                        content={"detail": "Location 헤더가 누락된 리다이렉트 응답"},
                        status_code=500
                    )
            else:
                return JSONResponse(
                    content=response.json() if response.content else {"detail": "No content"},
                    status_code=response.status_code
                )
                
    except Exception as e:
        logger.error(f"Google login proxy error: {str(e)}")
        return JSONResponse(
            content={"detail": f"Google 로그인 프록시 오류: {str(e)}"},
            status_code=500
        )

@auth_proxy_router.get("/google/callback", summary="Google 로그인 콜백")
async def google_callback(request: Request):
    """Google OAuth 콜백을 처리합니다."""
    try:
        async with httpx.AsyncClient() as client:
            # 쿼리 파라미터 전달 (code, scope, state 등)
            params = dict(request.query_params)
            
            logger.info(f"🔄 auth-service로 콜백 요청 전달: {params}")
            
            response = await client.get(
                f"{AUTH_SERVICE_URL}/auth/google/callback",
                params=params,
                follow_redirects=False
            )
            
            logger.info(f"📡 auth-service 응답 상태: {response.status_code}")
            logger.info(f"📡 auth-service 응답 헤더: {dict(response.headers)}")
            
            if response.status_code in [301, 302, 303, 307, 308]:
                # 리다이렉트 응답인 경우
                location = response.headers.get("location")
                logger.info(f"🔍 Location 헤더 값: {location}")
                
                if location:
                    # auth-service의 리다이렉트 응답을 그대로 전달
                    from fastapi import Response
                    redirect_response = Response(
                        status_code=response.status_code,
                        headers={"Location": location}
                    )
                    logger.info(f"✅ 리다이렉트 응답 생성 완료: {location}")
                    return redirect_response
                else:
                    logger.error("❌ Location 헤더가 없는 리다이렉트 응답")
                    return JSONResponse(
                        content={"detail": "Location 헤더가 누락된 리다이렉트 응답"},
                        status_code=500
                    )
            else:
                # JSON 응답을 그대로 반환 (JWT 토큰 포함)
                return JSONResponse(
                    content=response.json() if response.content else {"detail": "No content"},
                    status_code=response.status_code
                )
                
    except Exception as e:
        logger.error(f"Google callback proxy error: {str(e)}")
        return JSONResponse(
            content={"detail": f"Google 콜백 프록시 오류: {str(e)}"},
            status_code=500
        ) 