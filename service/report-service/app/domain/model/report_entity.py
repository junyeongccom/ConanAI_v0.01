from sqlalchemy import Column, String, Integer, Text, JSON, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Report(Base):
    __tablename__ = 'reports'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(Text, nullable=False)
    status = Column(Text, nullable=False, default='DRAFT')
    report_data = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())


class ReportTemplate(Base):
    __tablename__ = "report_template"
    
    report_content_id = Column(String(255), primary_key=True)
    section_kr = Column(String(255), nullable=True)
    content_order = Column(Integer, nullable=True)
    depth = Column(Integer, nullable=True)
    content_type = Column(String(255), nullable=True)
    content_template = Column(Text, nullable=True)
    source_requirement_ids = Column(JSON, nullable=True)
    slm_prompt_template = Column(Text, nullable=True) 