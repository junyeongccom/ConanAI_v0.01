# Answer 도메인 Controller
import logging
from typing import List
from uuid import UUID
from fastapi import HTTPException, status

from app.domain.service.answer_service import AnswerService
from app.domain.model.answer_schema import (
    AnswerBatchUpdatePayload,
    AnswerBatchResponse,
    AnswerResponse
)

logger = logging.getLogger("disclosure-service")

class AnswerController:
    """Answer 도메인 Request/Response 처리 계층"""
    
    def __init__(self, answer_service: AnswerService):
        self.answer_service = answer_service
    
    async def upsert_answers_batch(
        self, 
        user_id: UUID,
        payload: AnswerBatchUpdatePayload
    ) -> AnswerBatchResponse:
        """
        답변 배치 UPSERT 처리
        
        Args:
            user_id: 검증된 사용자 UUID
            payload: 배치 답변 업데이트 요청 데이터
            
        Returns:
            AnswerBatchResponse: 처리 결과
        """
        try:
            if not payload.answers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="답변 데이터가 비어있습니다."
                )
            
            result = self.answer_service.upsert_answers_batch(user_id, payload)
            
            logger.info(f"답변 배치 처리 완료: user_id={user_id}, 성공={result.processed_count}")
            return result
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 배치 처리 중 오류 발생: user_id={user_id}, error={str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 처리 중 서버 오류가 발생했습니다."
            )
    
    async def get_my_answers(self, user_id: UUID) -> List[AnswerResponse]:
        """
        내 답변 목록 조회
        
        Args:
            user_id: 검증된 사용자 UUID
            
        Returns:
            List[AnswerResponse]: 사용자 답변 목록
        """
        try:
            answers = self.answer_service.get_answers_by_user_id(user_id)
            
            logger.info(f"답변 목록 조회 완료: user_id={user_id}, 답변 수={len(answers)}")
            return answers
            
        except Exception as e:
            logger.error(f"답변 목록 조회 중 오류 발생: user_id={user_id}, error={str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 목록 조회 중 서버 오류가 발생했습니다."
            )
    
    async def get_my_answer_by_requirement(
        self, 
        user_id: UUID,
        requirement_id: str
    ) -> AnswerResponse:
        """
        특정 요구사항에 대한 내 답변 조회
        
        Args:
            user_id: 검증된 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            AnswerResponse: 답변 데이터
            
        Raises:
            HTTPException: 답변이 없거나 조회 중 오류 발생 시
        """
        try:
            answer = self.answer_service.get_answer_by_requirement(user_id, requirement_id)
            
            if not answer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"요구사항 {requirement_id}에 대한 답변을 찾을 수 없습니다."
                )
            
            logger.info(f"답변 조회 완료: user_id={user_id}, requirement_id={requirement_id}")
            return answer
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 조회 중 오류 발생: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 조회 중 서버 오류가 발생했습니다."
            )
    
    async def delete_my_answer(
        self, 
        user_id: UUID,
        requirement_id: str
    ) -> dict:
        """
        내 답변 삭제
        
        Args:
            user_id: 검증된 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            dict: 삭제 결과 메시지
            
        Raises:
            HTTPException: 답변이 없거나 삭제 중 오류 발생 시
        """
        try:
            success = self.answer_service.delete_answer(user_id, requirement_id)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"요구사항 {requirement_id}에 대한 답변을 찾을 수 없습니다."
                )
            
            logger.info(f"답변 삭제 완료: user_id={user_id}, requirement_id={requirement_id}")
            return {"message": f"요구사항 {requirement_id}에 대한 답변이 성공적으로 삭제되었습니다."}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 삭제 중 오류 발생: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 삭제 중 서버 오류가 발생했습니다."
            ) 