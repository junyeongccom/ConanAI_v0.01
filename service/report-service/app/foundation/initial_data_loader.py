import logging
import os
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv
from app.foundation.database import get_db

logger = logging.getLogger(__name__)

# 이 함수는 원래 CSV를 로드하는 데 사용되었을 수 있습니다.
# 현재는 구현이 없지만, 원래 파일 구조를 유지하기 위해 남겨둡니다.
def load_report_templates(db: Session):
    logger.info("CSV로부터 보고서 템플릿 로딩을 건너뜁니다 (구현 없음).")
    pass

def run_all_loaders():
    """모든 데이터 로더를 실행하는 메인 함수"""

    logger.info("데이터 로더 스크립트 실행 시작.")
    db_session = next(get_db())
    try:
        load_report_templates(db_session)
    finally:
        db_session.close()
        logger.info("데이터 로더 스크립트 실행 완료.")


if __name__ == "__main__":
    # .env 파일 로드를 위해 경로 설정
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..', '..', '..'))
    load_dotenv(dotenv_path=os.path.join(project_root, '.env'))
    
    run_all_loaders() 