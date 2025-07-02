import logging
import os
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# 이 함수는 원래 CSV를 로드하는 데 사용되었을 수 있습니다.
# 현재는 구현이 없지만, 원래 파일 구조를 유지하기 위해 남겨둡니다.
def load_report_templates(db: Session):
    logger.info("CSV로부터 보고서 템플릿 로딩을 건너뜁니다 (구현 없음).")
    pass

def upsert_static_templates(db: Session):
    """DB에 정적 템플릿 데이터를 UPSERT합니다."""
    logger.info("정적 보고서 템플릿 데이터 UPSERT 시도...")
    UPSERT_SQL = """
    INSERT INTO report_template (report_content_id, section_kr, content_order, depth, content_type, content_template, source_requirement_ids, slm_prompt_template)
    VALUES
        ('gen-p1', '일반 현황', 101, 2, 'STATIC_PARAGRAPH', '본 보고서는 2023년 6월 IFRS(International Financial Reporting Standards) 재단의 ISSB(International Sustainability Standards Board)에서 제정·공표한 IFRS S2 ''기후 관련 공시'' 요구사항에 대해 선제적으로 지속가능경영 현황을 공유하고 이해관계자와의 소통을 제고하기 위한 보고서입니다.''{{company_name}}''의 지속가능한 성장과 사회적 가치 창출을 위한 현재 또는 과거의 활동, 성과 외에도 미래에 대한 예측, 전망, 추정치에 관한 사항을 포함하고 있습니다. 미래와 관련된 사항들은 보고서 작성일을 기준으로 당사의 합리적 가정 및 예상, 기대에 기초한 것일 뿐이므로 알려지거나 알려지지 않은 위험과 불확실성을 수반하며, 예측, 전망, 추정치에 대한 실제 결과는 애초에 예측했던 것과는 상이할 수 있습니다.', '{"gen-1"}', NULL),
        ('gen-p2', '일반 현황', 102, 2, 'STATIC_PARAGRAPH', '본 보고서는 ''{{company_name}}''와 ''{{company_name}}''의 연결대상 종속기업에 대한 정보를 포함하고 있습니다.', '{"gen-1"}', NULL),
        ('gen-p3', '일반 현황', 103, 2, 'STATIC_PARAGRAPH', '본 보고서의 보고 기간은 ''{{start_date}}''부터 ''{{end_date}}''까지입니다.', '{"gen-1"}', NULL),
        ('cover-title', '표지', 1, 1, 'STATIC_PARAGRAPH', '{{report_year}} {{company_name}} CLIMATE CHANGE REPORT', '{"gen-1"}', NULL)
    ON CONFLICT (report_content_id) DO UPDATE SET
        section_kr = EXCLUDED.section_kr,
        content_order = EXCLUDED.content_order,
        depth = EXCLUDED.depth,
        content_type = EXCLUDED.content_type,
        content_template = EXCLUDED.content_template,
        source_requirement_ids = EXCLUDED.source_requirement_ids,
        slm_prompt_template = EXCLUDED.slm_prompt_template,
        updated_at = CURRENT_TIMESTAMP;
    """
    try:
        db.execute(text(UPSERT_SQL))
        db.commit()
        logger.info("정적 템플릿 데이터 UPSERT 성공.")
    except Exception as e:
        logger.error(f"정적 템플릿 UPSERT 실패: {e}")
        db.rollback()
        raise

def run_all_loaders():
    """모든 데이터 로더를 실행하는 메인 함수"""
    from app.foundation.database import get_db

    logger.info("데이터 로더 스크립트 실행 시작.")
    db_session = next(get_db())
    try:
        load_report_templates(db_session)
        upsert_static_templates(db_session)
    finally:
    db_session.close~   ()
    logger.info("데이터 로더 스크립트 실행 완료.")


if __name__ == "__main__":
    # .env 파일 로드를 위해 경로 설정
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..', '..', '..'))
    load_dotenv(dotenv_path=os.path.join(project_root, '.env'))
    
    run_all_loaders() 