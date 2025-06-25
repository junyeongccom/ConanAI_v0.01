# Answer 도메인 Repository
import logging
from typing import Optional, Dict, Any, List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import and_

from app.domain.model.answer_entity import Answer

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
    ) -> Optional[Answer]:
        """
        답변을 UPSERT (없으면 INSERT, 있으면 UPDATE) 처리하고 Answer 객체를 반환합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            data_to_update: 업데이트할 데이터 딕셔너리
            
        Returns:
            Answer: 생성되거나 수정된 Answer ORM 객체
        """
        try:
            # PostgreSQL의 ON CONFLICT DO UPDATE 구문 사용
            stmt = insert(Answer).values(
                user_id=user_id,
                requirement_id=requirement_id,
                **data_to_update
            )
            
            # 중복 시 업데이트할 컬럼 정의 (answered_at 제외)
            update_columns = {
                key: stmt.excluded[key] 
                for key in data_to_update.keys() 
                if key not in ['user_id', 'requirement_id', 'answered_at']
            }
            # last_edited_at은 항상 현재 시간으로 업데이트
            update_columns['last_edited_at'] = stmt.excluded.last_edited_at
            
            upsert_stmt = stmt.on_conflict_do_update(
                index_elements=['user_id', 'requirement_id'],
                set_=update_columns
            ).returning(Answer)
            
            result = self.db.execute(upsert_stmt)
            answer = result.fetchone()
            
            if answer:
                # fetchone()으로 가져온 결과를 Answer 객체로 변환
                return self.db.query(Answer).filter(
                    and_(
                        Answer.user_id == user_id,
                        Answer.requirement_id == requirement_id
                    )
                ).first()
            
            logger.info(f"답변 UPSERT 성공: user_id={user_id}, requirement_id={requirement_id}")
            return answer
            
        except Exception as e:
            logger.error(f"답변 UPSERT 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            raise e
    
    def get_answer_by_user_and_requirement(
        self, 
        user_id: UUID, 
        requirement_id: str
    ) -> Optional[Answer]:
        """
        사용자와 요구사항 ID로 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            Answer ORM 객체 또는 None
        """
        try:
            answer = self.db.query(Answer).filter(
                and_(
                    Answer.user_id == user_id,
                    Answer.requirement_id == requirement_id
                )
            ).first()
            
            return answer
            
        except Exception as e:
            logger.error(f"답변 조회 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            raise e
    
    def get_answers_by_user_id(self, user_id: UUID) -> List[Answer]:
        """
        사용자 ID로 모든 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            
        Returns:
            List[Answer]: Answer ORM 객체 리스트
        """
        try:
            answers = self.db.query(Answer).filter(Answer.user_id == user_id).all()
            return answers
            
        except Exception as e:
            logger.error(f"사용자 답변 목록 조회 실패: user_id={user_id}, error={str(e)}")
            raise e
    
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
            
            if deleted_count > 0:
                logger.info(f"답변 삭제 성공: user_id={user_id}, requirement_id={requirement_id}")
                return True
            else:
                logger.warning(f"삭제할 답변이 없음: user_id={user_id}, requirement_id={requirement_id}")
                return False
                
        except Exception as e:
            logger.error(f"답변 삭제 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            raise e 