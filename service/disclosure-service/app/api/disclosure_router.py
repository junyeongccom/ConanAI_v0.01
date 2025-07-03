from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.foundation.database import get_db
from app.domain.controller.disclosure_controller import DisclosureController
from app.domain.model.disclosure_schema import (
    DisclosureResponse,
    StructuredDisclosureResponse,
    RequirementResponse,
    TermResponse,
    ConceptResponse,
    AdoptionStatusResponse
)

# APIRouter 인스턴스 생성
router = APIRouter(tags=["Disclosure Data"])


# 의존성 주입 헬퍼 함수
def get_disclosure_controller(db: Session = Depends(get_db)) -> DisclosureController:
    """DisclosureController 의존성 주입"""
    return DisclosureController(db)


@router.get("/health")
async def health_check(
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: 서비스 상태 메시지
    """
    return await controller.get_health_status()


# 기후공시 개념 관련 엔드포인트
@router.get("/disclosure-data/concepts", 
           response_model=List[ConceptResponse], 
           summary="기후공시 개념 목록 조회")
async def get_concepts(
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    모든 기후공시 개념 목록을 반환합니다.
    
    Returns:
        List[ConceptResponse]: 기후공시 개념 목록
    """
    return await controller.get_concepts()


@router.get("/disclosure-data/concepts/{concept_id}", 
           response_model=ConceptResponse, 
           summary="기후공시 개념 상세 조회")
async def get_concept_by_id(
    concept_id: int,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ID로 특정 기후공시 개념을 조회합니다.
    
    Args:
        concept_id: 기후공시 개념 ID
        
    Returns:
        ConceptResponse: 기후공시 개념 상세 정보
    """
    return await controller.get_concept_by_id(concept_id)


# ISSB 도입 현황 관련 엔드포인트
@router.get("/disclosure-data/adoption-status", 
           response_model=List[AdoptionStatusResponse], 
           summary="국가별 ISSB 도입 현황 목록 조회")
async def get_adoption_status(
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    모든 국가별 ISSB 도입 현황 목록을 반환합니다.
    
    Returns:
        List[AdoptionStatusResponse]: 국가별 ISSB 도입 현황 목록
    """
    return await controller.get_adoption_status()


@router.get("/disclosure-data/adoption-status/{adoption_id}", 
           response_model=AdoptionStatusResponse, 
           summary="ISSB 도입 현황 상세 조회")
async def get_adoption_status_by_id(
    adoption_id: int,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ID로 특정 국가의 ISSB 도입 현황을 조회합니다.
    
    Args:
        adoption_id: ISSB 도입 현황 ID
        
    Returns:
        AdoptionStatusResponse: ISSB 도입 현황 상세 정보
    """
    return await controller.get_adoption_status_by_id(adoption_id)


@router.get("/disclosure-data/disclosures", 
           response_model=StructuredDisclosureResponse, 
           summary="ISSB S2 공시 정보 계층적 구조 조회")
async def get_disclosures(
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ISSB S2 공시 정보를 계층적 구조로 조회합니다.
    
    section과 category로 그룹화된 중첩된 JSON 객체를 반환합니다.
    프론트엔드에서 즉시 사용 가능한 최적화된 형태입니다.
        
    Returns:
        StructuredDisclosureResponse: section -> category -> disclosure items 구조의 계층적 데이터
        
    Example:
        {
            "지배구조": {
                "기후 관련 위험과 기회에 대한 이사회의 감독 사항": [
                    {
                        "disclosure_id": "s2-g1",
                        "topic": "목적",
                        "disclosure_ko": "기후 관련 위험 및 기회를 감독할 책임이 있는..."
                    }
                ]
            }
        }
    """
    return await controller.get_disclosures()


@router.get("/disclosure-data/disclosures/list", 
           response_model=List[DisclosureResponse], 
           summary="ISSB S2 공시 정보 목록 조회 (필터링 지원)")
async def get_disclosures_list(
    section: Optional[str] = Query(None, description="섹션으로 필터링"),
    category: Optional[str] = Query(None, description="카테고리로 필터링"),
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ISSB S2 공시 정보 목록을 조회합니다. (기존 방식, 필터링 지원)
    
    Args:
        section: 섹션 필터 (선택사항)
        category: 카테고리 필터 (선택사항)
        
    Returns:
        List[DisclosureResponse]: ISSB S2 공시 정보 목록
    """
    return await controller.get_disclosures_list(section, category)


@router.get("/disclosure-data/disclosures/{disclosure_id}", 
           response_model=DisclosureResponse, 
           summary="ISSB S2 공시 정보 상세 조회")
async def get_disclosure_by_id(
    disclosure_id: str,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ID로 특정 ISSB S2 공시 정보를 조회합니다.
    
    Args:
        disclosure_id: 공시 정보 ID (예: s2-g1, s2-r2)
        
    Returns:
        DisclosureResponse: ISSB S2 공시 정보 상세 정보
    """
    return await controller.get_disclosure_by_id(disclosure_id)


@router.get("/disclosure-data/disclosures/{disclosure_id}/requirements",
           response_model=List[RequirementResponse],
           summary="특정 공시 지표에 대한 요구사항 목록 조회")
async def get_requirements_for_disclosure(
    disclosure_id: str,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    특정 disclosure_id에 해당하는 모든 요구사항(requirements) 목록을 조회합니다.
    
    Args:
        disclosure_id: 공시 지표 ID (예: s2-g1, s2-r2)
        
    Returns:
        List[RequirementResponse]: 해당 공시 지표의 요구사항 목록 (빈 리스트 가능)
    """
    return await controller.get_requirements_for_disclosure(disclosure_id)


@router.get("/disclosure-data/requirements/{requirement_id}",
           response_model=RequirementResponse,
           summary="요구사항 상세 조회")
async def get_requirement_by_id(
    requirement_id: str,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ID로 특정 요구사항의 상세 정보를 조회합니다.
    주로 input_schema를 얻기 위해 사용됩니다.
    
    Args:
        requirement_id: 요구사항 ID (예: s2-g1-1, s2-s1-1)
        
    Returns:
        RequirementResponse: 요구사항의 모든 상세 정보
    """
    return await controller.get_requirement_by_id(requirement_id)


# ISSB S2 용어 관련 엔드포인트
@router.get("/disclosure-data/terms", 
           response_model=List[TermResponse], 
           summary="ISSB S2 용어 목록 조회")
async def get_terms(
    keyword: Optional[str] = Query(None, description="검색 키워드"),
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ISSB S2 용어 목록을 조회합니다.
    
    Args:
        keyword: 검색 키워드 (선택사항)
        
    Returns:
        List[TermResponse]: ISSB S2 용어 목록
    """
    return await controller.get_terms(keyword)


@router.get("/disclosure-data/terms/{term_id}", 
           response_model=TermResponse, 
           summary="ISSB S2 용어 상세 조회")
async def get_term_by_id(
    term_id: int,
    controller: DisclosureController = Depends(get_disclosure_controller)
):
    """
    ID로 특정 ISSB S2 용어를 조회합니다.
    
    Args:
        term_id: 용어 ID
        
    Returns:
        TermResponse: ISSB S2 용어 상세 정보
    """
    return await controller.get_term_by_id(term_id) 