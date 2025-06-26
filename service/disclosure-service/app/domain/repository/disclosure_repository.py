# IFRS S2 지표 및 지속가능성 공시 데이터 액세스 레포지토리 
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.domain.model.disclosure_entity import (
    IssbS2Disclosure, 
    IssbS2Requirement, 
    IssbS2Term,
    ClimateDisclosureConcept, 
    IssbAdoptionStatus
)


class DisclosureRepository:
    """공시 데이터 관련 레포지토리"""
    
    def __init__(self, db: Session):
        self.db = db

    # ISSB S2 Disclosure 관련 메서드
    def get_disclosure_by_id(self, disclosure_id: str) -> Optional[IssbS2Disclosure]:
        """ID로 공시 정보를 조회합니다."""
        return self.db.query(IssbS2Disclosure).filter(
            IssbS2Disclosure.disclosure_id == disclosure_id
        ).first()

    def get_all_disclosures(self) -> List[IssbS2Disclosure]:
        """모든 공시 정보를 조회합니다."""
        return self.db.query(IssbS2Disclosure).all()

    def get_disclosures_by_section(self, section: str) -> List[IssbS2Disclosure]:
        """섹션별 공시 정보를 조회합니다."""
        return self.db.query(IssbS2Disclosure).filter(
            IssbS2Disclosure.section == section
        ).all()

    def get_disclosures_by_category(self, category: str) -> List[IssbS2Disclosure]:
        """카테고리별 공시 정보를 조회합니다."""
        return self.db.query(IssbS2Disclosure).filter(
            IssbS2Disclosure.category == category
        ).all()

    # ISSB S2 Requirement 관련 메서드
    def get_requirement_by_id(self, requirement_id: str) -> Optional[IssbS2Requirement]:
        """ID로 요구사항을 조회합니다."""
        return self.db.query(IssbS2Requirement).filter(
            IssbS2Requirement.requirement_id == requirement_id
        ).first()

    def get_requirements_by_disclosure_id(self, disclosure_id: str) -> List[IssbS2Requirement]:
        """공시 ID로 관련 요구사항들을 조회합니다."""
        return self.db.query(IssbS2Requirement).filter(
            IssbS2Requirement.disclosure_id == disclosure_id
        ).order_by(IssbS2Requirement.requirement_order).all()

    # ISSB S2 Term 관련 메서드
    def get_term_by_id(self, term_id: int) -> Optional[IssbS2Term]:
        """ID로 용어를 조회합니다."""
        return self.db.query(IssbS2Term).filter(
            IssbS2Term.term_id == term_id
        ).first()

    def get_all_terms(self) -> List[IssbS2Term]:
        """모든 용어를 조회합니다."""
        return self.db.query(IssbS2Term).order_by(IssbS2Term.term_ko).all()

    def search_terms(self, keyword: str) -> List[IssbS2Term]:
        """키워드로 용어를 검색합니다."""
        return self.db.query(IssbS2Term).filter(
            IssbS2Term.term_ko.contains(keyword) | 
            IssbS2Term.definition_ko.contains(keyword)
        ).all()

    # Climate Disclosure Concept 관련 메서드
    def get_concept_by_id(self, concept_id: int) -> Optional[ClimateDisclosureConcept]:
        """ID로 기후공시 개념을 조회합니다."""
        return self.db.query(ClimateDisclosureConcept).filter(
            ClimateDisclosureConcept.concept_id == concept_id
        ).first()

    def get_all_concepts(self) -> List[ClimateDisclosureConcept]:
        """모든 기후공시 개념을 조회합니다."""
        return self.db.query(ClimateDisclosureConcept).order_by(
            ClimateDisclosureConcept.concept_id
        ).all()

    def get_concepts_by_category(self, category: str) -> List[ClimateDisclosureConcept]:
        """카테고리별 기후공시 개념을 조회합니다."""
        return self.db.query(ClimateDisclosureConcept).filter(
            ClimateDisclosureConcept.category == category
        ).all()

    # ISSB Adoption Status 관련 메서드
    def get_adoption_status_by_id(self, adoption_id: int) -> Optional[IssbAdoptionStatus]:
        """ID로 ISSB 도입 현황을 조회합니다."""
        return self.db.query(IssbAdoptionStatus).filter(
            IssbAdoptionStatus.adoption_id == adoption_id
        ).first()

    def get_all_adoption_status(self) -> List[IssbAdoptionStatus]:
        """모든 국가별 ISSB 도입 현황을 조회합니다."""
        return self.db.query(IssbAdoptionStatus).order_by(
            IssbAdoptionStatus.country
        ).all()

    def get_adoption_status_by_country(self, country: str) -> Optional[IssbAdoptionStatus]:
        """국가명으로 ISSB 도입 현황을 조회합니다."""
        return self.db.query(IssbAdoptionStatus).filter(
            IssbAdoptionStatus.country == country
        ).first()

    # User와 Answer 관련 메서드는 각각 auth-service와 answer 도메인으로 분리됨 