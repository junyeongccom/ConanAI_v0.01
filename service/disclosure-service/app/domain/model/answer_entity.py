# Answer 도메인 전용 엔티티
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UUID
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.foundation.database import Base


class Answer(Base):
    """사용자별 요구사항 응답 데이터 테이블"""
    
    __tablename__ = "answer"
    
    answer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, comment="사용자 UUID (auth-service의 member 테이블 참조)")
    requirement_id = Column(String(255), ForeignKey("issb_s2_requirement.requirement_id", ondelete="CASCADE"), nullable=False)
    
    # 다양한 타입의 답변 값을 저장하는 컬럼들
    answer_value_text = Column(Text, nullable=True, comment="텍스트 타입 답변")
    answer_value_number = Column(String(255), nullable=True, comment="숫자 타입 답변")  # 정밀도를 위해 String 사용
    answer_value_boolean = Column(String(10), nullable=True, comment="불린 타입 답변 (true/false)")
    answer_value_date = Column(DateTime(timezone=True), nullable=True, comment="날짜 타입 답변")
    answer_value_json = Column(JSONB, nullable=True, comment="JSON/복합 타입 답변")
    
    # 메타데이터
    answered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_edited_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    status = Column(String(50), nullable=False, default='DRAFT', comment="상태 (DRAFT, SUBMITTED, APPROVED)")
    
    # 관계 설정 없음 - 도메인 분리를 위해 직접 참조 대신 ID로만 연결
    
    # 복합 유니크 제약 (사용자당 요구사항별로 하나의 답변만)
    __table_args__ = (
        {'comment': '사용자별 요구사항 응답 데이터'}
    )
    
    def __repr__(self):
        return f"<Answer(id={self.answer_id}, user_id={self.user_id}, requirement_id={self.requirement_id})>"
    
    def get_primary_value(self):
        """주요 답변 값을 반환 (디스플레이용)"""
        if self.answer_value_text:
            return self.answer_value_text
        elif self.answer_value_number:
            return self.answer_value_number
        elif self.answer_value_boolean:
            return self.answer_value_boolean
        elif self.answer_value_date:
            return self.answer_value_date.isoformat()
        elif self.answer_value_json:
            return str(self.answer_value_json)
        return None 