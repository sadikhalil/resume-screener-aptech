from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Score(Base):
    __tablename__ = "scores"

    id           = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    job_id       = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    final_score  = Column(Float, nullable=False)
    breakdown    = Column(JSON, default={})
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate", back_populates="scores")
    job       = relationship("Job",       back_populates="scores")
