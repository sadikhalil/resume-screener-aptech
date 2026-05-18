from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id              = Column(Integer, primary_key=True, index=True)
    title           = Column(String, nullable=False)
    description     = Column(String, nullable=False)
    required_skills = Column(JSON, default=[])
    required_edu    = Column(String, default="bachelor")
    required_exp    = Column(Integer, default=0)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    scores = relationship("Score", back_populates="job", cascade="all, delete")
