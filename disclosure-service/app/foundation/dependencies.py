# 의존성 주입 중앙 관리 모듈
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.foundation.database import get_db
from app.domain.controller.answer_controller import AnswerController
from app.domain.service.answer_service import AnswerService
from app.domain.repository.answer_repository import AnswerRepository
from app.domain.repository.disclosure_repository import DisclosureRepository


def get_current_user_id(request: Request) -> UUID:
    """
    UserContextMiddleware가 request.state에 저장한 user_id를 추출하고 검증합니다.
    
    Args:
        request: FastAPI Request 객체
        
    Returns:
        UUID: 검증된 사용자 UUID
        
    Raises:
        HTTPException: 인증 정보가 없거나 잘못된 형식인 경우
    """
    user_id_str = getattr(request.state, 'user_id', None)
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="사용자 인증 정보가 없습니다."
        )
    
    try:
        return UUID(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="잘못된 사용자 ID 형식입니다."
        )


def get_answer_controller(db: Session = Depends(get_db)) -> AnswerController:
    """
    AnswerController 의존성 주입
    
    Args:
        db: 데이터베이스 세션
        
    Returns:
        AnswerController: 초기화된 Answer 컨트롤러
    """
    answer_repository = AnswerRepository(db)
    disclosure_repository = DisclosureRepository(db)
    answer_service = AnswerService(db, answer_repository, disclosure_repository)
    return AnswerController(answer_service) 