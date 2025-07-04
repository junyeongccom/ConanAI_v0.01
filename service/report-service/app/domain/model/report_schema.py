from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

class SavedReportBase(BaseModel):
    title: str
    status: Optional[str] = 'DRAFT'

class SavedReportCreate(SavedReportBase):
    report_data: List[Dict[str, Any]]

class SavedReportUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    report_data: Optional[List[Dict[str, Any]]] = None

class SavedReportInDB(SavedReportBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SavedReportBrief(BaseModel):
    id: UUID
    title: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SavedReportDetail(SavedReportInDB):
    report_data: List[Dict[str, Any]] 