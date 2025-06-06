"""
기후 데이터 엔티티 정의 (DB 테이블 매핑)
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class HeatwaveSummary(Base):
    """폭염일수 요약 테이블"""
    
    __tablename__ = "heatwave_summary"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    scenario = Column(String(50), nullable=False, comment="기후 시나리오")
    region_name = Column(String(100), nullable=False, comment="지역명")
    year_period = Column(String(10), nullable=False, comment="연도구간")
    heatwave_days = Column(Float, nullable=False, comment="폭염일수")
    change_amount = Column(Float, nullable=True, comment="변화량(일수)")
    change_rate = Column(Float, nullable=True, comment="변화율(%)")
    baseline_value = Column(Float, nullable=True, comment="기준값(현재기후)")
    created_at = Column(DateTime, default=func.now(), comment="생성일시")
    
    def __repr__(self):
        return f"<HeatwaveSummary(scenario='{self.scenario}', region='{self.region_name}', period='{self.year_period}')>" 