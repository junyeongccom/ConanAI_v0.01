"""
JWT 토큰 생성 및 검증 유틸리티
"""
import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from jose import jwt, JWTError
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# JWT 관련 환경 변수
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # 기본 24시간

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    JWT 액세스 토큰 생성
    
    Args:
        data: JWT에 포함할 데이터 (user_id, email, username 등)
        expires_delta: 토큰 만료 시간 (기본: 24시간)
    
    Returns:
        생성된 JWT 토큰 문자열
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "jti": uuid.uuid4().hex  # 고유한 토큰 ID 추가
    })
    
    # 사용자 ID를 user_id 키로 추가 (gateway에서 사용)
    if "sub" in to_encode:
        to_encode["user_id"] = to_encode["sub"]
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    """
    JWT 토큰 검증
    
    Args:
        token: 검증할 JWT 토큰
    
    Returns:
        검증 성공 시 토큰 데이터, 실패 시 None
    """
    try:
        decoded_token = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        return decoded_token
    except JWTError as e:
        print(f"JWT 검증 실패: {e}")
        return None

async def verify_jwt_with_blacklist(token: str) -> Optional[Dict[str, Any]]:
    """
    JWT 토큰 검증 (블랙리스트 확인 포함)
    
    Args:
        token: 검증할 JWT 토큰
    
    Returns:
        검증 성공 시 토큰 데이터, 실패 시 None
    """
    # 1. 기본 JWT 검증
    decoded_token = verify_jwt(token)
    if not decoded_token:
        return None
    
    # 2. 블랙리스트 확인
    jti = decoded_token.get("jti")
    if jti:
        try:
            from app.foundation.redis_client import get_redis_client
            redis_client = get_redis_client()
            
            # Redis에서 블랙리스트 확인
            blacklisted = await redis_client.get(f"blacklist:{jti}")
            if blacklisted:
                print(f"🚫 블랙리스트된 토큰 감지: jti={jti}")
                return None
                
        except Exception as e:
            print(f"블랙리스트 확인 중 오류: {e}")
            # Redis 연결 실패 시에도 기본 JWT 검증은 통과시킴
            pass
    
    return decoded_token

def extract_user_id_from_token(token: str) -> Optional[str]:
    """
    JWT 토큰에서 사용자 ID 추출
    
    Args:
        token: JWT 토큰
    
    Returns:
        사용자 ID 또는 None
    """
    decoded_token = verify_jwt(token)
    if decoded_token:
        return decoded_token.get("user_id") or decoded_token.get("sub")
    return None 