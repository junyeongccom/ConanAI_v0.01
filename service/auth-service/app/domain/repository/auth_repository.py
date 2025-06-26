# 인증 관련 레포지토리 - 데이터베이스 접근 계층
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import datetime

from app.domain.model.auth_entity import User
from app.domain.model.auth_schema import UserCreate

class UserRepository:
    """사용자 데이터베이스 접근을 담당하는 레포지토리"""
    
    def find_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """이메일로 사용자 조회"""
        return db.query(User).filter(User.email == email).first()
    
    def find_user_by_id(self, db: Session, user_id: uuid.UUID) -> Optional[User]:
        """사용자 ID로 사용자 조회"""
        return db.query(User).filter(User.user_id == user_id).first()
    
    def find_user_by_google_id(self, db: Session, google_id: str) -> Optional[User]:
        """Google ID로 사용자 조회"""
        return db.query(User).filter(User.google_id == google_id).first()
    
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
    
    # 기존 호환성을 위한 별칭 메서드들
    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """이메일로 사용자 조회 (기존 호환성)"""
        return self.find_user_by_email(db, email)
    
    def get_user_by_google_id(self, db: Session, google_id: str) -> Optional[User]:
        """Google ID로 사용자 조회 (기존 호환성)"""
        return self.find_user_by_google_id(db, google_id) 