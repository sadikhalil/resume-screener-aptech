from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=True)
    email       = Column(String, nullable=True)
    phone       = Column(String, nullable=True)
    skills      = Column(JSON, default=[])
    education   = Column(String, nullable=True)
    experience  = Column(Integer, default=0)
    resume_text = Column(String, nullable=True)
    file_path   = Column(String, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    scores = relationship("Score", back_populates="candidate", cascade="all, delete")
