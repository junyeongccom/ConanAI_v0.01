# Answer 도메인 Repository
import logging
from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import and_

from app.domain.model.answer_entity import Answer
from app.domain.model.answer_schema import AnswerResponse

logger = logging.getLogger("disclosure-service")

class AnswerRepository:
    """Answer 도메인 데이터 액세스 계층"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def upsert_answer(
        self,
        user_id: UUID,
        requirement_id: str,
        data_to_update: Dict[str, Any]
    ) -> bool:
        """
        답변을 UPSERT (없으면 INSERT, 있으면 UPDATE) 처리합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            data_to_update: 업데이트할 데이터 딕셔너리
            
        Returns:
            bool: 성공 여부
        """
        try:
            # PostgreSQL의 ON CONFLICT DO UPDATE 구문 사용
            stmt = insert(Answer).values(
                user_id=user_id,
                requirement_id=requirement_id,
                **data_to_update
            )
            
            # 중복 시 업데이트할 컬럼 정의 (created_at 제외)
            update_columns = {
                key: stmt.excluded[key] 
                for key in data_to_update.keys() 
                if key not in ['user_id', 'requirement_id', 'created_at']
            }
            # updated_at은 항상 현재 시간으로 업데이트
            update_columns['updated_at'] = stmt.excluded.updated_at
            
            upsert_stmt = stmt.on_conflict_do_update(
                index_elements=['user_id', 'requirement_id'],
                set_=update_columns
            )
            
            self.db.execute(upsert_stmt)
            self.db.commit()
            
            logger.info(f"답변 UPSERT 성공: user_id={user_id}, requirement_id={requirement_id}")
            return True
            
        except Exception as e:
            logger.error(f"답변 UPSERT 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            self.db.rollback()
            return False
    
    def get_answer_by_user_and_requirement(
        self, 
        user_id: UUID, 
        requirement_id: str
    ) -> Optional[AnswerResponse]:
        """
        사용자와 요구사항 ID로 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            AnswerResponse 또는 None
        """
        try:
            answer = self.db.query(Answer).filter(
                and_(
                    Answer.user_id == user_id,
                    Answer.requirement_id == requirement_id
                )
            ).first()
            
            if answer:
                return AnswerResponse.from_orm(answer)
            return None
            
        except Exception as e:
            logger.error(f"답변 조회 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            return None
    
    def get_answers_by_user_id(self, user_id: UUID) -> list[AnswerResponse]:
        """
        사용자 ID로 모든 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            
        Returns:
            List[AnswerResponse]
        """
        try:
            answers = self.db.query(Answer).filter(Answer.user_id == user_id).all()
            return [AnswerResponse.from_orm(answer) for answer in answers]
            
        except Exception as e:
            logger.error(f"사용자 답변 목록 조회 실패: user_id={user_id}, error={str(e)}")
            return []
    
    def delete_answer(self, user_id: UUID, requirement_id: str) -> bool:
        """
        답변을 삭제합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            bool: 삭제 성공 여부
        """
        try:
            deleted_count = self.db.query(Answer).filter(
                and_(
                    Answer.user_id == user_id,
                    Answer.requirement_id == requirement_id
                )
            ).delete()
            
            self.db.commit()
            
            if deleted_count > 0:
                logger.info(f"답변 삭제 성공: user_id={user_id}, requirement_id={requirement_id}")
                return True
            else:
                logger.warning(f"삭제할 답변이 없음: user_id={user_id}, requirement_id={requirement_id}")
                return False
                
        except Exception as e:
            logger.error(f"답변 삭제 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            self.db.rollback()
            return False 