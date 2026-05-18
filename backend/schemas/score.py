from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScoreResponse(BaseModel):
    id:           int
    candidate_id: int
    job_id:       int
    final_score:  float
    breakdown:    Optional[dict] = {}
    created_at:   Optional[datetime] = None

    class Config:
        from_attributes = True
