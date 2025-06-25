# Answer 도메인 Router
from fastapi import APIRouter, Depends, Request
from typing import List, Optional
from sqlalchemy.orm import Session

from app.foundation.database import get_db
from app.domain.controller.answer_controller import AnswerController
from app.domain.service.answer_service import AnswerService
from app.domain.repository.answer_repository import AnswerRepository
from app.domain.repository.disclosure_repository import DisclosureRepository
from app.domain.model.answer_schema import (
    AnswerBatchUpdatePayload,
    AnswerBatchResponse,
    AnswerResponse
)

# APIRouter 인스턴스 생성
router = APIRouter(tags=["Answers"], prefix="/answers")


# 의존성 주입 헬퍼 함수
def get_answer_controller(db: Session = Depends(get_db)) -> AnswerController:
    """AnswerController 의존성 주입"""
    answer_repository = AnswerRepository(db)
    disclosure_repository = DisclosureRepository(db)
    answer_service = AnswerService(answer_repository, disclosure_repository)
    return AnswerController(answer_service)


@router.post("/batch", 
            response_model=AnswerBatchResponse,
            summary="답변 배치 업데이트",
            description="여러 답변을 한 번에 생성하거나 업데이트합니다 (UPSERT)")
async def upsert_answers_batch(
    request: Request,
    payload: AnswerBatchUpdatePayload,
    controller: AnswerController = Depends(get_answer_controller)
):
    """
    여러 답변을 배치로 UPSERT 처리합니다.
    
    - **UPSERT**: 답변이 존재하지 않으면 새로 생성, 존재하면 업데이트
    - **data_required_type에 따른 자동 매핑**: 요구사항의 데이터 타입에 따라 적절한 컬럼에 저장
    - **트랜잭션 처리**: 각 답변별로 독립적으로 처리되어 일부 실패가 전체에 영향을 주지 않음
    
    Args:
        request: FastAPI Request 객체 (사용자 ID 추출용)
        payload: 배치 답변 업데이트 요청 데이터
        
    Returns:
        AnswerBatchResponse: 처리 결과 (성공/실패 개수, 실패한 요구사항 목록 등)
    """
    return await controller.upsert_answers_batch(request, payload)


@router.get("/my", 
           response_model=List[AnswerResponse],
           summary="내 답변 목록 조회",
           description="현재 로그인한 사용자의 모든 답변을 조회합니다")
async def get_my_answers(
    request: Request,
    controller: AnswerController = Depends(get_answer_controller)
):
    """
    현재 사용자의 모든 답변을 조회합니다.
    
    Args:
        request: FastAPI Request 객체 (사용자 ID 추출용)
        
    Returns:
        List[AnswerResponse]: 사용자 답변 목록
    """
    return await controller.get_my_answers(request)


@router.get("/my/{requirement_id}",
           response_model=AnswerResponse,
           summary="특정 요구사항에 대한 내 답변 조회",
           description="특정 요구사항 ID에 대한 현재 사용자의 답변을 조회합니다")
async def get_my_answer_by_requirement(
    requirement_id: str,
    request: Request,
    controller: AnswerController = Depends(get_answer_controller)
):
    """
    특정 요구사항에 대한 현재 사용자의 답변을 조회합니다.
    
    Args:
        requirement_id: 요구사항 ID (예: met-1, met-2)
        request: FastAPI Request 객체 (사용자 ID 추출용)
        
    Returns:
        AnswerResponse: 답변 정보
        
    Raises:
        404: 답변이 존재하지 않는 경우
    """
    return await controller.get_my_answer_by_requirement(request, requirement_id)


@router.delete("/my/{requirement_id}",
              summary="특정 요구사항에 대한 내 답변 삭제",
              description="특정 요구사항 ID에 대한 현재 사용자의 답변을 삭제합니다")
async def delete_my_answer(
    requirement_id: str,
    request: Request,
    controller: AnswerController = Depends(get_answer_controller)
):
    """
    특정 요구사항에 대한 현재 사용자의 답변을 삭제합니다.
    
    Args:
        requirement_id: 요구사항 ID (예: met-1, met-2)
        request: FastAPI Request 객체 (사용자 ID 추출용)
        
    Returns:
        dict: 삭제 결과 메시지
        
    Raises:
        404: 삭제할 답변이 존재하지 않는 경우
    """
    return await controller.delete_my_answer(request, requirement_id) 