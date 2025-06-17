from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.foundation.database import get_db
from app.domain.service.disclosure_service import DisclosureService
from app.domain.repository.disclosure_repository import DisclosureRepository
from app.domain.model.disclosure_schema import (
    DisclosureResponse,
    RequirementResponse,
    TermResponse,
    ConceptResponse,
    AdoptionStatusResponse
)

# APIRouter 인스턴스 생성
router = APIRouter(tags=["Disclosure Data"])


# 의존성 주입 헬퍼 함수
def get_disclosure_service(db: Session = Depends(get_db)) -> DisclosureService:
    """DisclosureService 의존성 주입"""
    repo = DisclosureRepository(db)
    return DisclosureService(repo)


@router.get("/health")
async def health_check():
    """
    서비스 상태 확인 엔드포인트
    
    Returns:
        dict: 서비스 상태 메시지
    """
    return {"message": "Hello World from disclosure-service"}


# 기후공시 개념 관련 엔드포인트
@router.get("/disclosure-data/concepts", 
           response_model=List[ConceptResponse], 
           summary="기후공시 개념 목록 조회")
async def get_concepts(
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    모든 기후공시 개념 목록을 반환합니다.
    
    Returns:
        List[ConceptResponse]: 기후공시 개념 목록
    """
    try:
        concepts = disclosure_service.get_climate_disclosure_concepts()
        if not concepts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="기후공시 개념을 찾을 수 없습니다."
            )
        return concepts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"기후공시 개념 조회 중 오류 발생: {str(e)}"
        )


@router.get("/disclosure-data/concepts/{concept_id}", 
           response_model=ConceptResponse, 
           summary="기후공시 개념 상세 조회")
async def get_concept_by_id(
    concept_id: int,
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ID로 특정 기후공시 개념을 조회합니다.
    
    Args:
        concept_id: 기후공시 개념 ID
        
    Returns:
        ConceptResponse: 기후공시 개념 상세 정보
    """
    try:
        concept = disclosure_service.get_concept_by_id(concept_id)
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


# ISSB 도입 현황 관련 엔드포인트
@router.get("/disclosure-data/adoption-status", 
           response_model=List[AdoptionStatusResponse], 
           summary="국가별 ISSB 도입 현황 목록 조회")
async def get_adoption_status(
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    모든 국가별 ISSB 도입 현황 목록을 반환합니다.
    
    Returns:
        List[AdoptionStatusResponse]: 국가별 ISSB 도입 현황 목록
    """
    try:
        adoption_status_list = disclosure_service.get_issb_adoption_status()
        if not adoption_status_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="ISSB 도입 현황을 찾을 수 없습니다."
            )
        return adoption_status_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"ISSB 도입 현황 조회 중 오류 발생: {str(e)}"
        )


@router.get("/disclosure-data/adoption-status/{adoption_id}", 
           response_model=AdoptionStatusResponse, 
           summary="ISSB 도입 현황 상세 조회")
async def get_adoption_status_by_id(
    adoption_id: int,
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ID로 특정 국가의 ISSB 도입 현황을 조회합니다.
    
    Args:
        adoption_id: ISSB 도입 현황 ID
        
    Returns:
        AdoptionStatusResponse: ISSB 도입 현황 상세 정보
    """
    try:
        status_info = disclosure_service.get_adoption_status_by_id(adoption_id)
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


# ISSB S2 공시 정보 관련 엔드포인트
@router.get("/disclosure-data/disclosures", 
           response_model=List[DisclosureResponse], 
           summary="ISSB S2 공시 정보 목록 조회")
async def get_disclosures(
    section: Optional[str] = Query(None, description="섹션으로 필터링"),
    category: Optional[str] = Query(None, description="카테고리로 필터링"),
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ISSB S2 공시 정보 목록을 조회합니다.
    
    Args:
        section: 섹션 필터 (선택사항)
        category: 카테고리 필터 (선택사항)
        
    Returns:
        List[DisclosureResponse]: ISSB S2 공시 정보 목록
    """
    try:
        if section:
            disclosures = disclosure_service.get_disclosures_by_section(section)
        elif category:
            disclosures = disclosure_service.get_disclosures_by_category(category)
        else:
            disclosures = disclosure_service.get_all_disclosures()
            
        if not disclosures:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="공시 정보를 찾을 수 없습니다."
            )
        return disclosures
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"공시 정보 조회 중 오류 발생: {str(e)}"
        )


@router.get("/disclosure-data/disclosures/{disclosure_id}", 
           response_model=DisclosureResponse, 
           summary="ISSB S2 공시 정보 상세 조회")
async def get_disclosure_by_id(
    disclosure_id: int,
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ID로 특정 ISSB S2 공시 정보를 조회합니다.
    
    Args:
        disclosure_id: 공시 정보 ID
        
    Returns:
        DisclosureResponse: ISSB S2 공시 정보 상세 정보
    """
    try:
        disclosure = disclosure_service.get_disclosure_by_id(disclosure_id)
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


# ISSB S2 요구사항 관련 엔드포인트
@router.get("/disclosure-data/requirements", 
           response_model=List[RequirementResponse], 
           summary="ISSB S2 요구사항 목록 조회")
async def get_requirements(
    disclosure_id: Optional[int] = Query(None, description="공시 ID로 필터링"),
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ISSB S2 요구사항 목록을 조회합니다.
    
    Args:
        disclosure_id: 공시 ID 필터 (선택사항)
        
    Returns:
        List[RequirementResponse]: ISSB S2 요구사항 목록
    """
    try:
        if disclosure_id:
            requirements = disclosure_service.get_requirements_by_disclosure_id(disclosure_id)
        else:
            requirements = disclosure_service.get_all_requirements()
            
        if not requirements:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="요구사항을 찾을 수 없습니다."
            )
        return requirements
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"요구사항 조회 중 오류 발생: {str(e)}"
        )


@router.get("/disclosure-data/requirements/{requirement_id}", 
           response_model=RequirementResponse, 
           summary="ISSB S2 요구사항 상세 조회")
async def get_requirement_by_id(
    requirement_id: int,
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ID로 특정 ISSB S2 요구사항을 조회합니다.
    
    Args:
        requirement_id: 요구사항 ID
        
    Returns:
        RequirementResponse: ISSB S2 요구사항 상세 정보
    """
    try:
        requirement = disclosure_service.get_requirement_by_id(requirement_id)
        if not requirement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"ID {requirement_id}에 해당하는 요구사항을 찾을 수 없습니다."
            )
        return requirement
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"요구사항 조회 중 오류 발생: {str(e)}"
        )


# ISSB S2 용어 관련 엔드포인트
@router.get("/disclosure-data/terms", 
           response_model=List[TermResponse], 
           summary="ISSB S2 용어 목록 조회")
async def get_terms(
    keyword: Optional[str] = Query(None, description="검색 키워드"),
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ISSB S2 용어 목록을 조회합니다.
    
    Args:
        keyword: 검색 키워드 (선택사항)
        
    Returns:
        List[TermResponse]: ISSB S2 용어 목록
    """
    try:
        if keyword:
            terms = disclosure_service.search_terms(keyword)
        else:
            terms = disclosure_service.get_all_terms()
            
        if not terms:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="용어를 찾을 수 없습니다."
            )
        return terms
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"용어 조회 중 오류 발생: {str(e)}"
        )


@router.get("/disclosure-data/terms/{term_id}", 
           response_model=TermResponse, 
           summary="ISSB S2 용어 상세 조회")
async def get_term_by_id(
    term_id: int,
    disclosure_service: DisclosureService = Depends(get_disclosure_service)
):
    """
    ID로 특정 ISSB S2 용어를 조회합니다.
    
    Args:
        term_id: 용어 ID
        
    Returns:
        TermResponse: ISSB S2 용어 상세 정보
    """
    try:
        term = disclosure_service.get_term_by_id(term_id)
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