# IFRS S2 지표 및 지속가능성 공시 관련 서비스 
from typing import List, Optional, Dict
from uuid import UUID
from collections import defaultdict

from app.domain.repository.disclosure_repository import DisclosureRepository
from app.domain.model.disclosure_schema import (
    DisclosureResponse,
    DisclosureItem,
    StructuredDisclosureResponse,
    RequirementResponse,
    TermResponse,
    ConceptResponse,
    AdoptionStatusResponse,
    UserResponse,
    AnswerResponse,
    AnswerCreateRequest,
    AnswerUpdateRequest
)


class DisclosureService:
    """공시 데이터 관련 비즈니스 로직 서비스"""
    
    def __init__(self, repo: DisclosureRepository):
        self.repo = repo

    # ISSB S2 Disclosure 관련 서비스 메서드
    def get_disclosure_by_id(self, disclosure_id: int) -> Optional[DisclosureResponse]:
        """ID로 공시 정보를 조회합니다."""
        disclosure = self.repo.get_disclosure_by_id(disclosure_id)
        if disclosure:
            return DisclosureResponse.from_orm(disclosure)
        return None

    def get_all_disclosures(self) -> List[DisclosureResponse]:
        """모든 공시 정보를 조회합니다."""
        disclosures = self.repo.get_all_disclosures()
        return [DisclosureResponse.from_orm(d) for d in disclosures]

    def get_disclosures_by_section(self, section: str) -> List[DisclosureResponse]:
        """섹션별 공시 정보를 조회합니다."""
        disclosures = self.repo.get_disclosures_by_section(section)
        return [DisclosureResponse.from_orm(d) for d in disclosures]

    def get_disclosures_by_category(self, category: str) -> List[DisclosureResponse]:
        """카테고리별 공시 정보를 조회합니다."""
        disclosures = self.repo.get_disclosures_by_category(category)
        return [DisclosureResponse.from_orm(d) for d in disclosures]

    def get_structured_disclosures(self) -> StructuredDisclosureResponse:
        """모든 공시 정보를 계층적 구조로 조회합니다."""
        # 모든 공시 정보를 가져옵니다
        disclosures = self.repo.get_all_disclosures()
        
        # 계층적 구조를 위한 중첩 딕셔너리 생성
        structured_data: Dict[str, Dict[str, List[DisclosureItem]]] = defaultdict(lambda: defaultdict(list))
        
        # 각 공시 정보를 section과 category로 그룹화
        for disclosure in disclosures:
            disclosure_item = DisclosureItem(
                disclosure_id=disclosure.disclosure_id,
                topic=disclosure.topic,
                disclosure_ko=disclosure.disclosure_ko
            )
            
            structured_data[disclosure.section][disclosure.category].append(disclosure_item)
        
        # defaultdict를 일반 dict로 변환하여 반환
        return {
            section: dict(categories) 
            for section, categories in structured_data.items()
        }

    # ISSB S2 Requirement 관련 서비스 메서드
    def get_requirements_by_disclosure_id(self, disclosure_id: int) -> List[RequirementResponse]:
        """공시 ID로 관련 요구사항들을 조회합니다."""
        requirements = self.repo.get_requirements_by_disclosure_id(disclosure_id)
        return [RequirementResponse.from_orm(r) for r in requirements]

    # ISSB S2 Term 관련 서비스 메서드
    def get_term_by_id(self, term_id: int) -> Optional[TermResponse]:
        """ID로 용어를 조회합니다."""
        term = self.repo.get_term_by_id(term_id)
        if term:
            return TermResponse.from_orm(term)
        return None

    def get_all_terms(self) -> List[TermResponse]:
        """모든 용어를 조회합니다."""
        terms = self.repo.get_all_terms()
        return [TermResponse.from_orm(t) for t in terms]

    def search_terms(self, keyword: str) -> List[TermResponse]:
        """키워드로 용어를 검색합니다."""
        terms = self.repo.search_terms(keyword)
        return [TermResponse.from_orm(t) for t in terms]

    # Climate Disclosure Concept 관련 서비스 메서드
    def get_concept_by_id(self, concept_id: int) -> Optional[ConceptResponse]:
        """ID로 기후공시 개념을 조회합니다."""
        concept = self.repo.get_concept_by_id(concept_id)
        if concept:
            return ConceptResponse.from_orm(concept)
        return None

    def get_climate_disclosure_concepts(self) -> List[ConceptResponse]:
        """모든 기후공시 개념을 조회하여 Pydantic 스키마로 반환합니다."""
        concepts = self.repo.get_all_concepts()
        return [ConceptResponse.from_orm(concept) for concept in concepts]

    def get_concepts_by_category(self, category: str) -> List[ConceptResponse]:
        """카테고리별 기후공시 개념을 조회합니다."""
        concepts = self.repo.get_concepts_by_category(category)
        return [ConceptResponse.from_orm(c) for c in concepts]

    # ISSB Adoption Status 관련 서비스 메서드
    def get_adoption_status_by_id(self, adoption_id: int) -> Optional[AdoptionStatusResponse]:
        """ID로 ISSB 도입 현황을 조회합니다."""
        status = self.repo.get_adoption_status_by_id(adoption_id)
        if status:
            return AdoptionStatusResponse.from_orm(status)
        return None

    def get_issb_adoption_status(self) -> List[AdoptionStatusResponse]:
        """모든 국가별 ISSB 도입 현황을 조회하여 Pydantic 스키마로 반환합니다."""
        adoption_status_list = self.repo.get_all_adoption_status()
        return [AdoptionStatusResponse.from_orm(status) for status in adoption_status_list]

    def get_adoption_status_by_country(self, country: str) -> Optional[AdoptionStatusResponse]:
        """국가명으로 ISSB 도입 현황을 조회합니다."""
        status = self.repo.get_adoption_status_by_country(country)
        if status:
            return AdoptionStatusResponse.from_orm(status)
        return None

    # User 관련 서비스 메서드
    def get_user_by_id(self, user_id: UUID) -> Optional[UserResponse]:
        """ID로 사용자를 조회합니다."""
        user = self.repo.get_user_by_id(user_id)
        if user:
            return UserResponse.from_orm(user)
        return None

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """이메일로 사용자를 조회합니다."""
        user = self.repo.get_user_by_email(email)
        if user:
            return UserResponse.from_orm(user)
        return None

    def get_user_by_google_id(self, google_id: str) -> Optional[UserResponse]:
        """Google ID로 사용자를 조회합니다."""
        user = self.repo.get_user_by_google_id(google_id)
        if user:
            return UserResponse.from_orm(user)
        return None

    def create_user(self, user_data: dict) -> UserResponse:
        """새 사용자를 생성합니다."""
        user = self.repo.create_user(user_data)
        return UserResponse.from_orm(user)

    def update_user(self, user_id: UUID, user_data: dict) -> Optional[UserResponse]:
        """사용자 정보를 업데이트합니다."""
        user = self.repo.update_user(user_id, user_data)
        if user:
            return UserResponse.from_orm(user)
        return None

    # Answer 관련 서비스 메서드
    def get_answer_by_id(self, answer_id: UUID) -> Optional[AnswerResponse]:
        """ID로 답변을 조회합니다."""
        answer = self.repo.get_answer_by_id(answer_id)
        if answer:
            return AnswerResponse.from_orm(answer)
        return None

    def get_answers_by_user_id(self, user_id: UUID) -> List[AnswerResponse]:
        """사용자 ID로 모든 답변을 조회합니다."""
        answers = self.repo.get_answers_by_user_id(user_id)
        return [AnswerResponse.from_orm(a) for a in answers]

    def get_answer_by_user_and_requirement(self, user_id: UUID, requirement_id: int) -> Optional[AnswerResponse]:
        """사용자와 요구사항으로 답변을 조회합니다."""
        answer = self.repo.get_answer_by_user_and_requirement(user_id, requirement_id)
        if answer:
            return AnswerResponse.from_orm(answer)
        return None

    def create_answer(self, user_id: UUID, answer_request: AnswerCreateRequest) -> AnswerResponse:
        """새 답변을 생성합니다."""
        answer_data = answer_request.dict()
        answer_data['user_id'] = user_id
        
        # 기존 답변이 있는지 확인
        existing_answer = self.repo.get_answer_by_user_and_requirement(
            user_id, answer_request.requirement_id
        )
        
        if existing_answer:
            # 기존 답변이 있으면 업데이트
            answer = self.repo.update_answer(existing_answer.answer_id, answer_data)
        else:
            # 없으면 새로 생성
            answer = self.repo.create_answer(answer_data)
        
        return AnswerResponse.from_orm(answer)

    def update_answer(self, answer_id: UUID, answer_request: AnswerUpdateRequest) -> Optional[AnswerResponse]:
        """답변을 업데이트합니다."""
        answer_data = answer_request.dict(exclude_unset=True)
        answer = self.repo.update_answer(answer_id, answer_data)
        if answer:
            return AnswerResponse.from_orm(answer)
        return None

    def delete_answer(self, answer_id: UUID) -> bool:
        """답변을 삭제합니다."""
        return self.repo.delete_answer(answer_id) 