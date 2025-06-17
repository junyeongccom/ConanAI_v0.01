import pandas as pd
import os
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging
from typing import Dict, Any

# ORM 모델 임포트
from app.domain.model.disclosure_entity import (
    IssbS2Disclosure, IssbS2Requirement, IssbS2Term,
    ClimateDisclosureConcept, IssbAdoptionStatus
)

logger = logging.getLogger(__name__)

# CSV 파일 경로 설정
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

# CSV 파일명 매핑
CSV_FILES = {
    "disclosure": "ISSB_S2 - issb_s2_disclosure.csv",
    "requirement": "ISSB_S2 - issb_s2_requirement.csv", 
    "term": "ISSB_S2 - issb_s2_term.csv",
    "concept": "ISSB_S2 - climate_disclosure_concept.csv",
    "adoption": "ISSB_S2 - issb_adoption_status.csv"
}


def _load_csv(file_name: str) -> pd.DataFrame:
    """CSV 파일을 읽어서 DataFrame으로 반환"""
    file_path = os.path.join(DATA_DIR, file_name)
    if not os.path.exists(file_path):
        logger.error(f"CSV 파일을 찾을 수 없습니다: {file_path}")
        return pd.DataFrame()
    
    try:
        df = pd.read_csv(file_path, encoding='utf-8')
        logger.info(f"CSV 파일 읽기 성공: {file_name} ({len(df)} 행)")
        return df
    except Exception as e:
        logger.error(f"CSV 파일 읽기 실패: {file_name} - {str(e)}")
        return pd.DataFrame()


def _clean_string_value(value: Any) -> str:
    """문자열 값을 정리하고 None 처리"""
    if pd.isna(value) or value == '' or str(value).strip() == '':
        return None
    return str(value).strip()


def _clean_numeric_value(value: Any) -> float:
    """숫자 값을 정리하고 None 처리"""
    if pd.isna(value) or value == '' or str(value).strip() == '':
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def _load_issb_s2_disclosures(db: Session) -> bool:
    """ISSB S2 공시 정보 데이터 적재"""
    try:
        # 기존 데이터 확인
        if db.query(IssbS2Disclosure).count() > 0:
            logger.info("IssbS2Disclosure 테이블에 이미 데이터가 존재합니다. 건너뜁니다.")
            return True

        df = _load_csv(CSV_FILES["disclosure"])
        if df.empty:
            logger.warning("Disclosure CSV 파일이 비어있습니다.")
            return False

        success_count = 0
        error_count = 0

        for index, record in df.iterrows():
            try:
                # 빈 행 건너뛰기
                if pd.isna(record.get('disclosure_id')) or record.get('disclosure_id') == '':
                    continue

                disclosure = IssbS2Disclosure(
                    section=_clean_string_value(record.get('section')),
                    category=_clean_string_value(record.get('category')),
                    topic=_clean_string_value(record.get('topic')),
                    paragraph=_clean_string_value(record.get('paragraph')),
                    disclosure_ko=_clean_string_value(record.get('disclosure_ko')),
                    disclosure_en=_clean_string_value(record.get('disclosure_en'))
                )
                
                db.add(disclosure)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Disclosure 데이터 추가 실패 (행 {index + 1}): {str(e)}")

        db.commit()
        logger.info(f"IssbS2Disclosure 데이터 적재 완료: 성공 {success_count}건, 실패 {error_count}건")
        return success_count > 0

    except Exception as e:
        db.rollback()
        logger.error(f"IssbS2Disclosure 데이터 적재 중 오류 발생: {str(e)}")
        return False


def _load_issb_s2_requirements(db: Session) -> bool:
    """ISSB S2 요구사항 데이터 적재"""
    try:
        # 기존 데이터 확인
        if db.query(IssbS2Requirement).count() > 0:
            logger.info("IssbS2Requirement 테이블에 이미 데이터가 존재합니다. 건너뜁니다.")
            return True

        df = _load_csv(CSV_FILES["requirement"])
        if df.empty:
            logger.warning("Requirement CSV 파일이 비어있습니다.")
            return False

        # disclosure_id 매핑을 위한 딕셔너리 생성
        disclosures = db.query(IssbS2Disclosure).all()
        disclosure_mapping = {}
        for disc in disclosures:
            # CSV의 disclosure_id 형식 (s2-1, s2-2 등)과 매핑
            key = f"s2-{disc.disclosure_id}"
            disclosure_mapping[key] = disc.disclosure_id

        success_count = 0
        error_count = 0

        for index, record in df.iterrows():
            try:
                # 빈 행 건너뛰기
                if pd.isna(record.get('requirement_id')) or record.get('requirement_id') == '':
                    continue

                # disclosure_id 매핑
                csv_disclosure_id = _clean_string_value(record.get('disclosure_id'))
                if not csv_disclosure_id or csv_disclosure_id not in disclosure_mapping:
                    logger.warning(f"매핑되지 않은 disclosure_id: {csv_disclosure_id} (행 {index + 1})")
                    error_count += 1
                    continue

                mapped_disclosure_id = disclosure_mapping[csv_disclosure_id]

                requirement = IssbS2Requirement(
                    disclosure_id=mapped_disclosure_id,
                    requirement_order=int(record.get('requirement_order', 1)),
                    requirement_text_ko=_clean_string_value(record.get('requirement_text_ko')),
                    data_required_type=_clean_string_value(record.get('data_required_type', 'text')),
                    input_placeholder_ko=_clean_string_value(record.get('input_placeholder_ko')),
                    input_guidance_ko=_clean_string_value(record.get('input_guidance_ko'))
                )
                
                db.add(requirement)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Requirement 데이터 추가 실패 (행 {index + 1}): {str(e)}")

        db.commit()
        logger.info(f"IssbS2Requirement 데이터 적재 완료: 성공 {success_count}건, 실패 {error_count}건")
        return success_count > 0

    except Exception as e:
        db.rollback()
        logger.error(f"IssbS2Requirement 데이터 적재 중 오류 발생: {str(e)}")
        return False


def _load_issb_s2_terms(db: Session) -> bool:
    """ISSB S2 용어 정의 데이터 적재"""
    try:
        # 기존 데이터 확인
        if db.query(IssbS2Term).count() > 0:
            logger.info("IssbS2Term 테이블에 이미 데이터가 존재합니다. 건너뜁니다.")
            return True

        df = _load_csv(CSV_FILES["term"])
        if df.empty:
            logger.warning("Term CSV 파일이 비어있습니다.")
            return False

        success_count = 0
        error_count = 0

        for index, record in df.iterrows():
            try:
                # 빈 행 건너뛰기
                if pd.isna(record.get('term_ko')) or record.get('term_ko') == '':
                    continue

                term = IssbS2Term(
                    term_ko=_clean_string_value(record.get('term_ko')),
                    term_en=_clean_string_value(record.get('term_en')),
                    definition_ko=_clean_string_value(record.get('definition_ko')),
                    definition_en=_clean_string_value(record.get('definition_en'))
                )
                
                db.add(term)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Term 데이터 추가 실패 (행 {index + 1}): {str(e)}")

        db.commit()
        logger.info(f"IssbS2Term 데이터 적재 완료: 성공 {success_count}건, 실패 {error_count}건")
        return success_count > 0

    except Exception as e:
        db.rollback()
        logger.error(f"IssbS2Term 데이터 적재 중 오류 발생: {str(e)}")
        return False


def _load_climate_disclosure_concepts(db: Session) -> bool:
    """기후공시 개념 데이터 적재"""
    try:
        # 기존 데이터 확인
        if db.query(ClimateDisclosureConcept).count() > 0:
            logger.info("ClimateDisclosureConcept 테이블에 이미 데이터가 존재합니다. 건너뜁니다.")
            return True

        df = _load_csv(CSV_FILES["concept"])
        if df.empty:
            logger.warning("Concept CSV 파일이 비어있습니다.")
            return False

        success_count = 0
        error_count = 0

        for index, record in df.iterrows():
            try:
                # 빈 행 건너뛰기
                if pd.isna(record.get('concept_name')) or record.get('concept_name') == '':
                    continue

                concept = ClimateDisclosureConcept(
                    concept_name=_clean_string_value(record.get('concept_name')),
                    description=_clean_string_value(record.get('description')),
                    category=_clean_string_value(record.get('category'))
                )
                
                db.add(concept)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Concept 데이터 추가 실패 (행 {index + 1}): {str(e)}")

        db.commit()
        logger.info(f"ClimateDisclosureConcept 데이터 적재 완료: 성공 {success_count}건, 실패 {error_count}건")
        return success_count > 0

    except Exception as e:
        db.rollback()
        logger.error(f"ClimateDisclosureConcept 데이터 적재 중 오류 발생: {str(e)}")
        return False


def _load_issb_adoption_status(db: Session) -> bool:
    """ISSB 도입 현황 데이터 적재"""
    try:
        # 기존 데이터 확인
        if db.query(IssbAdoptionStatus).count() > 0:
            logger.info("IssbAdoptionStatus 테이블에 이미 데이터가 존재합니다. 건너뜁니다.")
            return True

        df = _load_csv(CSV_FILES["adoption"])
        if df.empty:
            logger.warning("Adoption CSV 파일이 비어있습니다.")
            return False

        success_count = 0
        error_count = 0

        for index, record in df.iterrows():
            try:
                # 빈 행 건너뛰기
                if pd.isna(record.get('country')) or record.get('country') == '':
                    continue

                status = IssbAdoptionStatus(
                    country=_clean_string_value(record.get('country')),
                    regulatory_authority=_clean_string_value(record.get('regulatory_authority')),
                    applicable_entity=_clean_string_value(record.get('applicable_entity')),
                    adoption_timeline=_clean_string_value(record.get('adoption_timeline')),
                    remark=_clean_string_value(record.get('remark'))
                )
                
                db.add(status)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                logger.error(f"Adoption Status 데이터 추가 실패 (행 {index + 1}): {str(e)}")

        db.commit()
        logger.info(f"IssbAdoptionStatus 데이터 적재 완료: 성공 {success_count}건, 실패 {error_count}건")
        return success_count > 0

    except Exception as e:
        db.rollback()
        logger.error(f"IssbAdoptionStatus 데이터 적재 중 오류 발생: {str(e)}")
        return False


def load_initial_data(db: Session) -> bool:
    """
    초기 마스터 데이터 적재 메인 함수
    외래 키 제약 조건을 고려한 순서로 데이터 적재
    """
    logger.info("========================================")
    logger.info("초기 마스터 데이터 적재를 시작합니다...")
    logger.info("========================================")
    
    try:
        # 데이터 적재 순서 (외래 키 제약 조건 고려)
        results = []
        
        # 1. ISSB S2 공시 정보 (기본 테이블)
        logger.info("1. ISSB S2 공시 정보 적재 중...")
        results.append(_load_issb_s2_disclosures(db))
        
        # 2. ISSB S2 요구사항 (disclosure_id 참조)
        logger.info("2. ISSB S2 요구사항 적재 중...")
        results.append(_load_issb_s2_requirements(db))
        
        # 3. ISSB S2 용어 정의 (독립 테이블)
        logger.info("3. ISSB S2 용어 정의 적재 중...")
        results.append(_load_issb_s2_terms(db))
        
        # 4. 기후공시 개념 (독립 테이블)
        logger.info("4. 기후공시 개념 적재 중...")
        results.append(_load_climate_disclosure_concepts(db))
        
        # 5. ISSB 도입 현황 (독립 테이블)
        logger.info("5. ISSB 도입 현황 적재 중...")
        results.append(_load_issb_adoption_status(db))
        
        # 결과 요약
        success_count = sum(results)
        total_count = len(results)
        
        logger.info("========================================")
        if success_count == total_count:
            logger.info(f"✅ 초기 마스터 데이터 적재 완료: {success_count}/{total_count} 성공")
            return True
        else:
            logger.warning(f"⚠️ 초기 마스터 데이터 적재 부분 완료: {success_count}/{total_count} 성공")
            return success_count > 0
            
    except Exception as e:
        logger.error(f"❌ 초기 마스터 데이터 적재 중 예상치 못한 오류 발생: {str(e)}")
        return False
    finally:
        logger.info("========================================")


def check_data_integrity(db: Session) -> Dict[str, int]:
    """데이터 무결성 확인 및 테이블별 레코드 수 반환"""
    try:
        counts = {
            "disclosures": db.query(IssbS2Disclosure).count(),
            "requirements": db.query(IssbS2Requirement).count(),
            "terms": db.query(IssbS2Term).count(),
            "concepts": db.query(ClimateDisclosureConcept).count(),
            "adoption_status": db.query(IssbAdoptionStatus).count()
        }
        
        logger.info("📊 데이터베이스 현황:")
        for table, count in counts.items():
            logger.info(f"  - {table}: {count}건")
            
        return counts
        
    except Exception as e:
        logger.error(f"데이터 무결성 확인 중 오류 발생: {str(e)}")
        return {} 