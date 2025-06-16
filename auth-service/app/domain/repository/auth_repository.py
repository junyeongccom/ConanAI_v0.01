# 인증 관련 레포지토리 
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import datetime

from app.domain.model.user_entity import User
from app.domain.model.user_schema import UserCreate

class UserRepository:
    
    def get_user_by_google_id(self, db: Session, google_id: str) -> Optional[User]:
        """google_id를 사용하여 사용자 조회"""
        return db.query(User).filter(User.google_id == google_id).first()
    
    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """email을 사용하여 사용자 조회"""
        return db.query(User).filter(User.email == email).first()
    
    def create_user(self, db: Session, user_data: UserCreate) -> User:
        """새로운 사용자 생성"""
        db_user = User(
            google_id=user_data.google_id,
            email=user_data.email,
            username=user_data.username
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def update_user_last_login(self, db: Session, user_id: uuid.UUID) -> User:
        """사용자의 마지막 로그인 시간 업데이트"""
        db_user = db.query(User).filter(User.user_id == user_id).first()
        if db_user:
            db_user.last_login_at = datetime.utcnow()
            db.commit()
            db.refresh(db_user)
        return db_user 