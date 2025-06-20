# IFRS S2 지표 및 지속가능성 공시 엔티티 
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

Base = declarative_base()


class IssbS2Disclosure(Base):
    """ISSB S2 공시 정보 테이블"""
    
    __tablename__ = "issb_s2_disclosure"
    
    disclosure_id = Column(String(255), primary_key=True)
    section = Column(String(255), nullable=False, comment="섹션")
    category = Column(String(255), nullable=False, comment="카테고리")
    topic = Column(String(255), nullable=True, comment="주제")
    disclosure_ko = Column(Text, nullable=False, comment="한국어 공시 내용")
    
    # 관계 설정
    requirements = relationship("IssbS2Requirement", back_populates="disclosure", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<IssbS2Disclosure(id={self.disclosure_id}, section='{self.section}', category='{self.category}')>"


class IssbS2Requirement(Base):
    """ISSB S2 요구사항 테이블"""
    
    __tablename__ = "issb_s2_requirement"
    
    requirement_id = Column(String(255), primary_key=True)
    disclosure_id = Column(String(255), ForeignKey("issb_s2_disclosure.disclosure_id", ondelete="SET NULL"), nullable=True)
    requirement_order = Column(Integer, nullable=False, default=0, comment="요구사항 순서")
    requirement_text_ko = Column(Text, nullable=False, comment="한국어 요구사항 내용")
    data_required_type = Column(String(50), nullable=False, comment="필요한 데이터 타입")
    input_schema = Column(JSONB, nullable=True, comment="입력 스키마")
    input_placeholder_ko = Column(Text, nullable=True, comment="입력 플레이스홀더")
    input_guidance_ko = Column(Text, nullable=True, comment="입력 가이드")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # 관계 설정
    disclosure = relationship("IssbS2Disclosure", back_populates="requirements")
    answers = relationship("Answer", back_populates="requirement", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<IssbS2Requirement(id={self.requirement_id}, disclosure_id={self.disclosure_id}, order={self.requirement_order})>"


class IssbS2Term(Base):
    """ISSB S2 용어 정의 테이블"""
    
    __tablename__ = "issb_s2_term"
    
    term_id = Column(Integer, primary_key=True, autoincrement=True)
    term_ko = Column(String(255), unique=True, nullable=False, comment="한국어 용어")
    term_en = Column(String(255), nullable=True, comment="영어 용어")
    definition_ko = Column(Text, nullable=False, comment="한국어 정의")
    definition_en = Column(Text, nullable=True, comment="영어 정의")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<IssbS2Term(id={self.term_id}, term_ko='{self.term_ko}')>"


class ClimateDisclosureConcept(Base):
    """기후공시 개념 테이블"""
    
    __tablename__ = "climate_disclosure_concept"
    
    concept_id = Column(Integer, primary_key=True, autoincrement=True)
    concept_name = Column(String(255), unique=True, nullable=False, comment="개념명")
    description = Column(Text, nullable=False, comment="설명")
    category = Column(String(255), nullable=True, comment="카테고리")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<ClimateDisclosureConcept(id={self.concept_id}, name='{self.concept_name}')>"


class IssbAdoptionStatus(Base):
    """ISSB 도입 현황 테이블"""
    
    __tablename__ = "issb_adoption_status"
    
    adoption_id = Column(Integer, primary_key=True, autoincrement=True)
    country = Column(String(255), unique=True, nullable=False, comment="국가")
    regulatory_authority = Column(String(255), nullable=True, comment="규제 당국")
    applicable_entity = Column(String(255), nullable=True, comment="적용 대상 기업")
    adoption_timeline = Column(Text, nullable=True, comment="도입 일정")
    remark = Column(Text, nullable=True, comment="비고")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<IssbAdoptionStatus(id={self.adoption_id}, country='{self.country}')>"


class User(Base):
    """사용자 테이블 (auth-service와 공유)"""
    
    __tablename__ = "user"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    google_id = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=True)
    industry_type = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    
    # 관계 설정
    answers = relationship("Answer", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.user_id}, email='{self.email}')>"


class Answer(Base):
    """사용자별 요구사항 응답 데이터 테이블"""
    
    __tablename__ = "answer"
    
    answer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    requirement_id = Column(String(255), ForeignKey("issb_s2_requirement.requirement_id", ondelete="CASCADE"), nullable=False)
    answer_value_text = Column(Text, nullable=True)
    answer_value_text_long = Column(Text, nullable=True)
    answer_value_json = Column(JSONB, nullable=True)
    answered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_edited_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), nullable=False, default='DRAFT', comment="상태 (DRAFT, SUBMITTED, APPROVED)")
    
    # 관계 설정
    user = relationship("User", back_populates="answers")
    requirement = relationship("IssbS2Requirement", back_populates="answers")
    
    def __repr__(self):
        return f"<Answer(id={self.answer_id}, user_id={self.user_id}, requirement_id={self.requirement_id})>" 