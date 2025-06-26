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
    UserContextMiddleware에 의해 설정된 request.state에서
    사용자 ID(UUID 객체)를 추출하고 검증합니다.
    
    Args:
        request: FastAPI Request 객체
        
    Returns:
        UUID: 검증된 사용자 UUID
        
    Raises:
        HTTPException: 인증 정보가 없거나 잘못된 형식인 경우
    """
    user_id = getattr(request.state, 'user_id', None)

    # 미들웨어에서 user_id가 설정되었는지 확인
    if not user_id:
        # 이 에러는 미들웨어가 제대로 동작하지 않았다는 의미의 서버 에러에 가까움
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="사용자 컨텍스트를 설정할 수 없습니다."
        )

    # user_id가 UUID 타입이 맞는지 확인
    if not isinstance(user_id, UUID):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"잘못된 사용자 ID 타입입니다: {type(user_id)}"
        )

    return user_id


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