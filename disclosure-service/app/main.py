import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.disclosure_router import router as disclosure_router

# DB 세션 및 초기 데이터 로더 임포트
from app.foundation.database import get_db, check_database_connection
from app.foundation.initial_data_loader import load_initial_data, check_data_integrity

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("disclosure_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 라이프사이클 관리"""
    logger.info("🚀 Disclosure API 서비스 시작")
    
    # --- 데이터 적재 로직 추가 시작 ---
    try:
        # 데이터베이스 연결 확인
        if not check_database_connection():
            logger.error("❌ 데이터베이스 연결 실패. 서비스를 시작할 수 없습니다.")
            raise Exception("Database connection failed")
        
        # DB 세션 생성
        db_session = next(get_db())
        
        try:
            # 초기 데이터 적재
            logger.info("📋 초기 마스터 데이터 적재 시작...")
            load_success = load_initial_data(db_session)
            
            if load_success:
                logger.info("✅ 초기 마스터 데이터 적재 성공")
                
                # 데이터 무결성 확인
                data_counts = check_data_integrity(db_session)
                if data_counts:
                    total_records = sum(data_counts.values())
                    logger.info(f"📊 총 {total_records}건의 마스터 데이터가 준비되었습니다.")
                else:
                    logger.warning("⚠️ 데이터 무결성 확인 중 문제가 발생했습니다.")
            else:
                logger.warning("⚠️ 초기 마스터 데이터 적재에 일부 문제가 있었습니다. 서비스는 계속 진행됩니다.")
                
        except Exception as e:
            logger.error(f"❌ 초기 데이터 적재 실패: {str(e)}")
            logger.warning("⚠️ 데이터 적재 실패했지만 서비스는 계속 진행됩니다.")
        finally:
            db_session.close()
            
    except Exception as e:
        logger.error(f"❌ 서비스 초기화 실패: {str(e)}")
        # 데이터베이스 연결 실패 등 심각한 문제 시 서비스 중단
        raise
    # --- 데이터 적재 로직 추가 종료 ---
    
    yield
    
    logger.info("🛑 Disclosure API 서비스 종료")


# FastAPI 애플리케이션 생성
app = FastAPI(
    title="Disclosure Service",
    description="IFRS S2 지표 및 공시 정보 처리 서비스 API",
    version="1.0.0",
    lifespan=lifespan  # lifespan 함수 등록
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(disclosure_router, tags=["disclosure"])


# 헬스 체크 엔드포인트
@app.get("/health")
async def health_check():
    """서비스 상태 확인"""
    try:
        db_session = next(get_db())
        data_counts = check_data_integrity(db_session)
        db_session.close()
        
        return {
            "status": "healthy",
            "service": "disclosure-service",
            "database": "connected",
            "data_counts": data_counts
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "disclosure-service", 
            "error": str(e)
        }


# 직접 실행 시 Uvicorn 서버로 실행
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8083"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 