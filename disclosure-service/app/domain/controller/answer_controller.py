# Answer 도메인 Controller
import logging
from typing import List, Optional
from uuid import UUID
from fastapi import Request, HTTPException, status

from app.domain.service.answer_service import AnswerService
from app.domain.model.answer_schema import (
    AnswerBatchUpdatePayload,
    AnswerBatchResponse,
    AnswerResponse
)

logger = logging.getLogger("disclosure-service")

class AnswerController:
    """Answer 도메인 컨트롤러 - Request/Response 처리 및 비즈니스 로직 조율"""
    
    def __init__(self, answer_service: AnswerService):
        self.answer_service = answer_service
    
    def _get_user_id_from_request(self, request: Request) -> UUID:
        """
        Request에서 사용자 ID를 추출합니다.
        
        Args:
            request: FastAPI Request 객체
            
        Returns:
            UUID: 사용자 ID
            
        Raises:
            HTTPException: 사용자 ID가 없거나 잘못된 경우
        """
        user_id = getattr(request.state, 'user_id', None)
        if not user_id:
            logger.error("요청에서 사용자 ID를 찾을 수 없습니다.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="사용자 인증이 필요합니다."
            )
        
        if not isinstance(user_id, UUID):
            logger.error(f"잘못된 사용자 ID 형식: {type(user_id)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="잘못된 사용자 ID 형식입니다."
            )
        
        return user_id
    
    async def upsert_answers_batch(
        self, 
        request: Request, 
        payload: AnswerBatchUpdatePayload
    ) -> AnswerBatchResponse:
        """
        여러 답변을 배치로 UPSERT 처리합니다.
        
        Args:
            request: FastAPI Request 객체 (사용자 ID 추출용)
            payload: 배치 답변 업데이트 요청 데이터
            
        Returns:
            AnswerBatchResponse: 처리 결과
            
        Raises:
            HTTPException: 사용자 인증 실패 또는 요청 데이터 오류
        """
        try:
            # 사용자 ID 추출
            user_id = self._get_user_id_from_request(request)
            
            # 요청 데이터 검증
            if not payload.answers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="답변 데이터가 비어있습니다."
                )
            
            logger.info(f"답변 배치 처리 요청: user_id={user_id}, 답변 수={len(payload.answers)}")
            
            # 비즈니스 로직 처리
            result = self.answer_service.upsert_answers_batch(user_id, payload)
            
            # 결과에 따른 HTTP 상태 코드 결정
            if result.success:
                logger.info(f"답변 배치 처리 성공: user_id={user_id}")
                return result
            else:
                logger.warning(f"답변 배치 처리 일부 실패: user_id={user_id}, 실패 수={result.failed_count}")
                # 일부 실패는 200으로 반환하되 클라이언트가 결과를 확인할 수 있도록 함
                return result
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 배치 처리 중 예외 발생: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 처리 중 서버 오류가 발생했습니다."
            )
    
    async def get_my_answers(self, request: Request) -> List[AnswerResponse]:
        """
        현재 사용자의 모든 답변을 조회합니다.
        
        Args:
            request: FastAPI Request 객체 (사용자 ID 추출용)
            
        Returns:
            List[AnswerResponse]: 사용자 답변 목록
            
        Raises:
            HTTPException: 사용자 인증 실패
        """
        try:
            user_id = self._get_user_id_from_request(request)
            
            logger.info(f"사용자 답변 목록 조회 요청: user_id={user_id}")
            
            answers = self.answer_service.get_answers_by_user_id(user_id)
            
            logger.info(f"사용자 답변 목록 조회 완료: user_id={user_id}, 답변 수={len(answers)}")
            return answers
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"사용자 답변 조회 중 예외 발생: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 조회 중 서버 오류가 발생했습니다."
            )
    
    async def get_my_answer_by_requirement(
        self, 
        request: Request, 
        requirement_id: str
    ) -> Optional[AnswerResponse]:
        """
        특정 요구사항에 대한 현재 사용자의 답변을 조회합니다.
        
        Args:
            request: FastAPI Request 객체 (사용자 ID 추출용)
            requirement_id: 요구사항 ID
            
        Returns:
            AnswerResponse 또는 None
            
        Raises:
            HTTPException: 사용자 인증 실패
        """
        try:
            user_id = self._get_user_id_from_request(request)
            
            logger.info(f"특정 답변 조회 요청: user_id={user_id}, requirement_id={requirement_id}")
            
            answer = self.answer_service.get_answer_by_requirement(user_id, requirement_id)
            
            if answer:
                logger.info(f"답변 조회 성공: user_id={user_id}, requirement_id={requirement_id}")
            else:
                logger.info(f"답변 없음: user_id={user_id}, requirement_id={requirement_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"요구사항 {requirement_id}에 대한 답변을 찾을 수 없습니다."
                )
            
            return answer
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 조회 중 예외 발생: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 조회 중 서버 오류가 발생했습니다."
            )
    
    async def delete_my_answer(
        self, 
        request: Request, 
        requirement_id: str
    ) -> dict:
        """
        특정 요구사항에 대한 현재 사용자의 답변을 삭제합니다.
        
        Args:
            request: FastAPI Request 객체 (사용자 ID 추출용)
            requirement_id: 요구사항 ID
            
        Returns:
            dict: 삭제 결과 메시지
            
        Raises:
            HTTPException: 사용자 인증 실패 또는 삭제 실패
        """
        try:
            user_id = self._get_user_id_from_request(request)
            
            logger.info(f"답변 삭제 요청: user_id={user_id}, requirement_id={requirement_id}")
            
            success = self.answer_service.delete_answer(user_id, requirement_id)
            
            if success:
                logger.info(f"답변 삭제 성공: user_id={user_id}, requirement_id={requirement_id}")
                return {
                    "success": True,
                    "message": f"요구사항 {requirement_id}에 대한 답변이 삭제되었습니다."
                }
            else:
                logger.warning(f"삭제할 답변이 없음: user_id={user_id}, requirement_id={requirement_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"요구사항 {requirement_id}에 대한 답변을 찾을 수 없습니다."
                )
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"답변 삭제 중 예외 발생: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="답변 삭제 중 서버 오류가 발생했습니다."
            ) 