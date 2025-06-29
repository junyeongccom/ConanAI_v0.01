import os
import redis.asyncio as redis
from dotenv import load_dotenv

load_dotenv()

class RedisClient:
    _pool = None

    @classmethod
    def get_pool(cls):
        if cls._pool is None:
            redis_host = os.getenv("REDIS_HOST", "redis")  # Docker 서비스명 기본값
            redis_port = int(os.getenv("REDIS_PORT", "6379"))  # Redis 기본 포트

            print(f"🔄 Redis 연결 풀 생성 중... -> {redis_host}:{redis_port}")

            cls._pool = redis.ConnectionPool(
                host=redis_host, 
                port=redis_port, 
                db=0, 
                decode_responses=True  # 응답을 자동으로 utf-8 디코딩
            )
        return cls._pool

    @classmethod
    def get_connection(cls):
        pool = cls.get_pool()
        return redis.Redis(connection_pool=pool)

# 어디서든 이 함수를 호출하여 Redis 클라이언트를 가져올 수 있음
def get_redis_client():
    return RedisClient.get_connection() 