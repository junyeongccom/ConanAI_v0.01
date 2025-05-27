"""
asyncpg 기반 비동기 데이터베이스 커넥션 풀 관리 모듈 (Railway & 로컬 겸용)
"""

import os
from typing import Dict, Optional, Any, AsyncGenerator
from dotenv import load_dotenv
from urllib.parse import urlparse
import asyncpg
from asyncpg.pool import Pool

# 로컬 환경에서만 .env 로드
if os.getenv("RAILWAY_ENVIRONMENT") is None:
    load_dotenv()

# 글로벌 커넥션 풀
_pool: Optional[Pool] = None

def _get_connection_params() -> Dict[str, Any]:
    """
    Railway 환경에서는 DATABASE_URL 사용,
    로컬 환경에서는 DB_HOST 등 개별 변수 사용.
    """
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        parsed = urlparse(database_url)
        return {
            "user": parsed.username,
            "password": parsed.password,
            "database": parsed.path[1:],  # '/db' → 'db'
            "host": parsed.hostname,
            "port": parsed.port,
        }
    else:
        # 로컬 개발 환경
        db_host = os.getenv("DB_HOST")
        db_port = os.getenv("DB_PORT")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_name = os.getenv("DB_NAME")

        missing_vars = [
            var for var in ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"]
            if os.getenv(var) is None
        ]
        if missing_vars:
            raise ValueError(f"필수 환경 변수가 누락됨: {', '.join(missing_vars)}")

        return {
            "host": db_host,
            "port": int(db_port),
            "user": db_user,
            "password": db_password,
            "database": db_name,
        }

async def get_pool() -> Pool:
    global _pool
    if _pool is None:
        connection_params = _get_connection_params()
        _pool = await asyncpg.create_pool(
            **connection_params,
            min_size=5,
            max_size=20,
            timeout=30.0,
            command_timeout=60.0,
            max_inactive_connection_lifetime=1800.0,
        )
        print("[INFO] asyncpg 커넥션 풀이 초기화되었습니다.")
    return _pool

async def get_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    pool = await get_pool()
    async with pool.acquire() as connection:
        yield connection
