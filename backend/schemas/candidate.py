from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CandidateBase(BaseModel):
    name:       Optional[str] = None
    email:      Optional[str] = None
    phone:      Optional[str] = None
    skills:     Optional[List[str]] = []
    education:  Optional[str] = None
    experience: Optional[int] = 0

class CandidateResponse(CandidateBase):
    id:         int
    file_path:  Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
