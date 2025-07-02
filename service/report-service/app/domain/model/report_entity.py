from sqlalchemy import Column, String, Integer, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

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