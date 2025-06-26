# IFRS S2 지표 및 지속가능성 공시 관련 컨트롤러 
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.domain.service.disclosure_service import DisclosureService
from app.domain.repository.disclosure_repository import DisclosureRepository
from app.domain.model.disclosure_schema import (
    DisclosureResponse,
    StructuredDisclosureResponse,
    RequirementResponse,
    TermResponse,
    ConceptResponse,
    AdoptionStatusResponse
)


class DisclosureController:
    """공시 데이터 관련 비즈니스 로직을 처리하는 컨트롤러"""
    
    def __init__(self, db: Session):
        """컨트롤러 초기화"""
        self.disclosure_service = DisclosureService(DisclosureRepository(db))
    
    async def get_health_status(self) -> dict:
        """서비스 상태 확인"""
        return {"message": "Hello World from disclosure-service"}
    
    # 기후공시 개념 관련 메서드
    async def get_concepts(self) -> List[ConceptResponse]:
        """모든 기후공시 개념 목록을 반환합니다."""
        try:
            concepts = self.disclosure_service.get_climate_disclosure_concepts()
            if not concepts:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="기후공시 개념을 찾을 수 없습니다."
                )
            return concepts
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"기후공시 개념 조회 중 오류 발생: {str(e)}"
            )
    
    async def get_concept_by_id(self, concept_id: int) -> ConceptResponse:
        """ID로 특정 기후공시 개념을 조회합니다."""
        try:
            concept = self.disclosure_service.get_concept_by_id(concept_id)
            if not concept:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"ID {concept_id}에 해당하는 기후공시 개념을 찾을 수 없습니다."
                )
            return concept
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"기후공시 개념 조회 중 오류 발생: {str(e)}"
            )
    
    # ISSB 도입 현황 관련 메서드
    async def get_adoption_status(self) -> List[AdoptionStatusResponse]:
        """모든 국가별 ISSB 도입 현황 목록을 반환합니다."""
        try:
            adoption_status_list = self.disclosure_service.get_issb_adoption_status()
            if not adoption_status_list:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="ISSB 도입 현황을 찾을 수 없습니다."
                )
            return adoption_status_list
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"ISSB 도입 현황 조회 중 오류 발생: {str(e)}"
            )
    
    async def get_adoption_status_by_id(self, adoption_id: int) -> AdoptionStatusResponse:
        """ID로 특정 국가의 ISSB 도입 현황을 조회합니다."""
        try:
            status_info = self.disclosure_service.get_adoption_status_by_id(adoption_id)
            if not status_info:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"ID {adoption_id}에 해당하는 ISSB 도입 현황을 찾을 수 없습니다."
                )
            return status_info
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"ISSB 도입 현황 조회 중 오류 발생: {str(e)}"
            )
    
    # 공시 정보 관련 메서드
    async def get_disclosures(self) -> StructuredDisclosureResponse:
        """ISSB S2 공시 정보를 계층적 구조로 조회합니다."""
        try:
            structured_disclosures = self.disclosure_service.get_structured_disclosures()
            if not structured_disclosures:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="공시 정보를 찾을 수 없습니다."
                )
            return structured_disclosures
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"공시 정보 조회 중 오류 발생: {str(e)}"
            )
    
    async def get_disclosures_list(
        self, 
        section: Optional[str] = None, 
        category: Optional[str] = None
    ) -> List[DisclosureResponse]:
        """ISSB S2 공시 정보 목록을 조회합니다. (필터링 지원)"""
        try:
            if section:
                disclosures = self.disclosure_service.get_disclosures_by_section(section)
            elif category:
                disclosures = self.disclosure_service.get_disclosures_by_category(category)
            else:
                disclosures = self.disclosure_service.get_all_disclosures()
                
            if not disclosures:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="공시 정보를 찾을 수 없습니다."
                )
            return disclosures
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"공시 정보 조회 중 오류 발생: {str(e)}"
            )
    
    async def get_disclosure_by_id(self, disclosure_id: str) -> DisclosureResponse:
        """ID로 특정 ISSB S2 공시 정보를 조회합니다."""
        try:
            disclosure = self.disclosure_service.get_disclosure_by_id(disclosure_id)
            if not disclosure:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"ID {disclosure_id}에 해당하는 공시 정보를 찾을 수 없습니다."
                )
            return disclosure
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"공시 정보 조회 중 오류 발생: {str(e)}"
            )
    
    # 요구사항 관련 메서드
    async def get_requirements_for_disclosure(self, disclosure_id: str) -> List[RequirementResponse]:
        """특정 disclosure_id에 해당하는 모든 요구사항 목록을 조회합니다."""
        try:
            requirements = self.disclosure_service.get_requirements_by_disclosure_id(disclosure_id)
            return requirements  # 빈 리스트도 정상 반환
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"요구사항 조회 중 오류 발생: {str(e)}"
            )
    
    # 용어 관련 메서드
    async def get_terms(self, keyword: Optional[str] = None) -> List[TermResponse]:
        """ISSB S2 용어 목록을 조회합니다."""
        try:
            if keyword:
                terms = self.disclosure_service.search_terms(keyword)
            else:
                terms = self.disclosure_service.get_all_terms()
                
            if not terms:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="용어를 찾을 수 없습니다."
                )
            return terms
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"용어 조회 중 오류 발생: {str(e)}"
            )
    
    async def get_term_by_id(self, term_id: int) -> TermResponse:
        """ID로 특정 ISSB S2 용어를 조회합니다."""
        try:
            term = self.disclosure_service.get_term_by_id(term_id)
            if not term:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"ID {term_id}에 해당하는 용어를 찾을 수 없습니다."
                )
            return term
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"용어 조회 중 오류 발생: {str(e)}"
            ) 