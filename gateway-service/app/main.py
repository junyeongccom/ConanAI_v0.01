# gateway.py
import json
import os
import logging
import sys
from fastapi import APIRouter, FastAPI, Request, UploadFile, File, Query, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any

from app.domain.model.service_type import ServiceType
from app.domain.model.service_factory import ServiceProxyFactory
from app.api.auth_proxy_router import auth_proxy_router
from app.foundation.jwt_auth_middleware import AuthMiddleware

# ✅ 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("gateway-api")

# ✅ .env 파일 로드
load_dotenv()

# ✅ JWT 관련 환경 변수 로드 (미들웨어와 프록시 라우터에서 사용)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8084")

# ✅ 애플리케이션 시작 시 실행
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Gateway API 서비스 시작")
    yield
    logger.info("🛑 Gateway API 서비스 종료")

# ✅ FastAPI 앱 생성 
app = FastAPI(
    title="Gateway API",
    description="Gateway API for conan.ai.kr",
    version="0.1.0",
    docs_url="/docs",
    lifespan=lifespan
)

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 환경에서는 구체적인 도메인 지정 필요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ JWT 인증 미들웨어 추가
app.add_middleware(AuthMiddleware)

# ✅ Google OAuth 프록시 라우터 포함 (동적 라우팅보다 먼저)
app.include_router(auth_proxy_router, prefix="/auth", tags=["Auth Proxy"])

# ✅ 메인 라우터 생성
gateway_router = APIRouter(prefix="/api", tags=["gateway"])

# ✅ 파일이 필요한 서비스 목록 (현재는 없음)
FILE_REQUIRED_SERVICES = set()

# ✅ 유틸리티 함수: 요청 처리 결과 반환
def create_response(response):
    """서비스 응답에 대한 일관된 응답 생성"""
    try:
        if response.status_code == 200:
            return JSONResponse(
                content=response.json(),
                status_code=response.status_code
            )
        else:
            return JSONResponse(
                content={"detail": f"Service error: {response.text}"},
                status_code=response.status_code
            )
    except json.JSONDecodeError:
        return JSONResponse(
            content={"detail": "⚠️Invalid JSON response from service"},
            status_code=500
        )
    except Exception as e:
        logger.error(f"Error creating response: {str(e)}")
        return JSONResponse(
            content={"detail": f"Gateway error: {str(e)}"},
            status_code=500
        )

# GET - 일반 동적 라우팅 (JWT 적용)
@gateway_router.get("/{service}/{path:path}", summary="GET 프록시")
async def proxy_get(
    service: ServiceType, 
    path: str, 
    request: Request
):
    try:
        factory = ServiceProxyFactory(service_type=service)
        
        # 헤더 전달 (JWT 및 사용자 ID)
        headers = dict(request.headers)
        if hasattr(request.state, 'user_id') and request.state.user_id:
            headers["X-User-Id"] = str(request.state.user_id)
        
        response = await factory.request(
            method="GET",
            path=path,
            headers=headers
        )
        return create_response(response)
    except Exception as e:
        logger.error(f"Error in GET proxy: {str(e)}")
        return JSONResponse(
            content={"detail": f"Error processing request: {str(e)}"},
            status_code=500
        )

# POST - 통합 동적 라우팅 (파일 업로드 및 일반 JSON 요청 모두 처리, JWT 적용)
@gateway_router.post("/{service}/{path:path}", summary="POST 프록시")
async def proxy_post(
    service: ServiceType, 
    path: str,
    request: Request,
    file: Optional[UploadFile] = None,
    sheet_names: Optional[List[str]] = Query(None, alias="sheet_name")
):
    try:
        # 로깅
        logger.info(f"🌈 POST 요청 받음: 서비스={service}, 경로={path}")
        if file:
            logger.info(f"파일명: {file.filename}, 시트 이름: {sheet_names if sheet_names else '없음'}")

        # 서비스 팩토리 생성
        factory = ServiceProxyFactory(service_type=service)
        
        # 요청 파라미터 초기화
        files = None
        params = None
        body = None
        data = None
        
        # 헤더 전달 (JWT 및 사용자 ID)
        headers = dict(request.headers)
        if hasattr(request.state, 'user_id') and request.state.user_id:
            headers["X-User-Id"] = str(request.state.user_id)
        
        # 파일이 필요한 서비스 처리
        if service in FILE_REQUIRED_SERVICES:
            # 파일이 필요한 서비스인 경우
            
            # 서비스 URI가 upload인 경우만 파일 체크
            if "upload" in path and not file:
                raise HTTPException(status_code=400, detail=f"서비스 {service}에는 파일 업로드가 필요합니다.")
            
            # 파일이 제공된 경우 처리
            if file:
                file_content = await file.read()
                files = {'file': (file.filename, file_content, file.content_type)}
                
                # 파일 위치 되돌리기 (다른 코드에서 다시 읽을 수 있도록)
                await file.seek(0)
            
            # 시트 이름이 제공된 경우 처리
            if sheet_names:
                params = {'sheet_name': sheet_names}
        else:
            # 일반 서비스 처리 (body JSON 전달)
            try:
                body = await request.body()
                if not body:
                    # body가 비어있는 경우도 허용
                    logger.info("요청 본문이 비어 있습니다.")
            except Exception as e:
                logger.warning(f"요청 본문 읽기 실패: {str(e)}")
                
        # 서비스에 요청 전달
        response = await factory.request(
            method="POST",
            path=path,
            headers=headers,
            body=body,
            files=files,
            params=params,
            data=data
        )
        
        # 응답 처리 및 반환
        return create_response(response)
        
    except HTTPException as he:
        # HTTP 예외는 그대로 반환
        return JSONResponse(
            content={"detail": he.detail},
            status_code=he.status_code
        )
    except Exception as e:
        # 일반 예외는 로깅 후 500 에러 반환
        logger.error(f"POST 요청 처리 중 오류 발생: {str(e)}")
        return JSONResponse(
            content={"detail": f"Gateway error: {str(e)}"},
            status_code=500
        )

# PUT - 일반 동적 라우팅 (JWT 적용)
@gateway_router.put("/{service}/{path:path}", summary="PUT 프록시")
async def proxy_put(service: ServiceType, path: str, request: Request):
    try:
        factory = ServiceProxyFactory(service_type=service)
        
        # 헤더 전달 (JWT 및 사용자 ID)
        headers = dict(request.headers)
        if hasattr(request.state, 'user_id') and request.state.user_id:
            headers["X-User-Id"] = str(request.state.user_id)
        
        response = await factory.request(
            method="PUT",
            path=path,
            headers=headers,
            body=await request.body()
        )
        return create_response(response)
    except Exception as e:
        logger.error(f"Error in PUT proxy: {str(e)}")
        return JSONResponse(
            content={"detail": f"Error processing request: {str(e)}"},
            status_code=500
        )

# DELETE - 일반 동적 라우팅 (JWT 적용)
@gateway_router.delete("/{service}/{path:path}", summary="DELETE 프록시")
async def proxy_delete(service: ServiceType, path: str, request: Request):
    try:
        factory = ServiceProxyFactory(service_type=service)
        
        # 헤더 전달 (JWT 및 사용자 ID)
        headers = dict(request.headers)
        if hasattr(request.state, 'user_id') and request.state.user_id:
            headers["X-User-Id"] = str(request.state.user_id)
        
        response = await factory.request(
            method="DELETE",
            path=path,
            headers=headers,
            body=await request.body()
        )
        return create_response(response)
    except Exception as e:
        logger.error(f"Error in DELETE proxy: {str(e)}")
        return JSONResponse(
            content={"detail": f"Error processing request: {str(e)}"},
            status_code=500
        )

# PATCH - 일반 동적 라우팅 (JWT 적용)
@gateway_router.patch("/{service}/{path:path}", summary="PATCH 프록시")
async def proxy_patch(service: ServiceType, path: str, request: Request):
    try:
        factory = ServiceProxyFactory(service_type=service)
        
        # 헤더 전달 (JWT 및 사용자 ID)
        headers = dict(request.headers)
        if hasattr(request.state, 'user_id') and request.state.user_id:
            headers["X-User-Id"] = str(request.state.user_id)
        
        response = await factory.request(
            method="PATCH",
            path=path,
            headers=headers,
            body=await request.body()
        )
        return create_response(response)
    except Exception as e:
        logger.error(f"Error in PATCH proxy: {str(e)}")
        return JSONResponse(
            content={"detail": f"Error processing request: {str(e)}"},
            status_code=500
        )

# ✅ 메인 라우터 등록 (동적 라우팅)
app.include_router(gateway_router)

# 404 에러 핸들러
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "요청한 리소스를 찾을 수 없습니다."}
    )

# 기본 루트 경로
@app.get("/")
async def root():
    return {"message": "Gateway API", "version": "0.1.0"}

# ✅ 서버 실행
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("SERVICE_PORT", 8080))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
