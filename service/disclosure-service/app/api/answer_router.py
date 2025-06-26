# Answer API 라우터
from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID

from app.foundation.dependencies import get_current_user_id, get_answer_controller
from app.domain.controller.answer_controller import AnswerController
from app.domain.model.answer_schema import (
    AnswerBatchUpdatePayload,
    AnswerBatchResponse,
    AnswerResponse
)

router = APIRouter(prefix="/answers", tags=["Answer"])

@router.post(
    "/batch", 
    response_model=AnswerBatchResponse,
    status_code=status.HTTP_200_OK,
    summary="답변 배치 UPSERT",
    description="여러 답변을 한 번에 생성하거나 업데이트합니다."
)
async def upsert_answers_batch(
    payload: AnswerBatchUpdatePayload,
    user_id: UUID = Depends(get_current_user_id),
    controller: AnswerController = Depends(get_answer_controller)
) -> AnswerBatchResponse:
    """답변 배치 UPSERT 처리"""
    return await controller.upsert_answers_batch(user_id, payload)

@router.get(
    "/my",
    response_model=List[AnswerResponse],
    status_code=status.HTTP_200_OK,
    summary="내 답변 목록 조회",
    description="현재 사용자의 모든 답변을 조회합니다."
)
async def get_my_answers(
    user_id: UUID = Depends(get_current_user_id),
    controller: AnswerController = Depends(get_answer_controller)
) -> List[AnswerResponse]:
    """내 답변 목록 조회"""
    return await controller.get_my_answers(user_id)

@router.get(
    "/my/{requirement_id}",
    response_model=AnswerResponse,
    status_code=status.HTTP_200_OK,
    summary="특정 답변 조회",
    description="특정 요구사항에 대한 내 답변을 조회합니다."
)
async def get_my_answer_by_requirement(
    requirement_id: str,
    user_id: UUID = Depends(get_current_user_id),
    controller: AnswerController = Depends(get_answer_controller)
) -> AnswerResponse:
    """특정 요구사항에 대한 내 답변 조회"""
    return await controller.get_my_answer_by_requirement(user_id, requirement_id)

@router.delete(
    "/my/{requirement_id}",
    status_code=status.HTTP_200_OK,
    summary="답변 삭제",
    description="특정 요구사항에 대한 내 답변을 삭제합니다."
)
async def delete_my_answer(
    requirement_id: str,
    user_id: UUID = Depends(get_current_user_id),
    controller: AnswerController = Depends(get_answer_controller)
) -> dict:
    """특정 요구사항에 대한 내 답변 삭제"""
    return await controller.delete_my_answer(user_id, requirement_id) 