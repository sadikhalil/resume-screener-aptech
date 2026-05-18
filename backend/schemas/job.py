from pydantic import BaseModel
from typing import List
from datetime import datetime

class JobBase(BaseModel):
    title:           str
    description:     str
    required_skills: List[str] = []
    required_edu:    str = "bachelor"
    required_exp:    int = 0

class JobResponse(JobBase):
    id:         int
    created_at: datetime

    class Config:
        from_attributes = True
