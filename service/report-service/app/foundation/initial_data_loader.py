import pandas as pd
from sqlalchemy.orm import Session
import logging
import json  # source_requirement_ids를 위해 추가
import os

from app.domain.model.report_entity import ReportTemplate  # ORM 모델 임포트

logger = logging.getLogger(__name__)

def load_report_templates(db: Session):
    """보고서 템플릿 CSV 데이터를 데이터베이스에 로딩"""
    csv_path = "app/platform/data/report_template.csv"
    
    try:
        # CSV 파일 존재 여부 확인
        if not os.path.exists(csv_path):
            logger.error(f"❌ 보고서 템플릿 CSV 파일을 찾을 수 없습니다: {csv_path}")
            return
            
        # CSV 파일 읽기
        df = pd.read_csv(csv_path)
        logger.info(f"📄 CSV 파일 로드 완료: {len(df)}개 행")

        # NaN 값을 None으로 변환
        df = df.where(pd.notnull(df), None)

        new_templates_count = 0
        for _, row in df.iterrows():
            template_id = row['report_content_id']

            # DB에 이미 존재하는지 확인
            exists = db.query(ReportTemplate).filter_by(report_content_id=template_id).first()

            if not exists:
                # source_requirement_ids 컬럼을 Python 리스트(JSON)로 변환
                source_ids = None
                if row['source_requirement_ids']:
                    try:
                        # 문자열을 JSON(리스트)으로 파싱
                        source_ids = json.loads(row['source_requirement_ids'].replace("'", '"'))
                    except (json.JSONDecodeError, TypeError):
                        # 파싱 실패 시 문자열 그대로 사용하거나 로깅
                        logger.warning(f"Failed to parse source_requirement_ids for {template_id}: {row['source_requirement_ids']}")
                        source_ids = row['source_requirement_ids']

                new_template = ReportTemplate(
                    report_content_id=template_id,
                    section_kr=row['section_kr'],
                    content_order=row['content_order'],
                    depth=row['depth'],
                    content_type=row['content_type'],
                    content_template=row['content_template'],
                    source_requirement_ids=source_ids,
                    slm_prompt_template=row['slm_prompt_template']
                )
                db.add(new_template)
                new_templates_count += 1
                logger.debug(f"➕ 새 템플릿 추가: {template_id}")

        if new_templates_count > 0:
            db.commit()
            logger.info(f"✅ {new_templates_count}개의 새로운 보고서 템플릿을 DB에 추가했습니다.")
        else:
            logger.info("ℹ️ 보고서 템플릿은 이미 최신 상태입니다.")

    except FileNotFoundError:
        logger.error(f"❌ 보고서 템플릿 CSV 파일을 찾을 수 없습니다: {csv_path}")
    except Exception as e:
        db.rollback()
        logger.error(f"❌ 보고서 템플릿 로딩 중 에러 발생: {e}")
        raise 