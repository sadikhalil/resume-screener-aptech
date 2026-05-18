from sqlalchemy.orm import Session
import uuid
import json

from db.models.candidate import Candidate
from db.models.job import Job
from db.models.score import Score

# Candidate CRUD
def create_candidate(db: Session, filename: str, filepath: str, content: str):
    db_candidate = Candidate(
        uuid=str(uuid.uuid4()),
        filename=filename,
        filepath=filepath,
        content=content,
        extracted_data=json.dumps({}), # Initialize with empty JSON
        embedding=json.dumps([]) # Initialize with empty list
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def get_candidate(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

def get_candidates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Candidate).offset(skip).limit(limit).all()

def update_candidate(db: Session, candidate_id: int, extracted_data: dict = None, embedding: list = None):
    db_candidate = get_candidate(db, candidate_id)
    if db_candidate:
        if extracted_data is not None:
            db_candidate.extracted_data = json.dumps(extracted_data)
        if embedding is not None:
            db_candidate.embedding = json.dumps(embedding)
        db.commit()
        db.refresh(db_candidate)
    return db_candidate

# Job CRUD
def create_job(db: Session, title: str, description: str):
    db_job = Job(
        uuid=str(uuid.uuid4()),
        title=title,
        description=description,
        embedding=json.dumps([]) # Initialize with empty list
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_job(db: Session, job_id: int):
    return db.query(Job).filter(Job.id == job_id).first()

def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Job).offset(skip).limit(limit).all()

def update_job_embedding(db: Session, job_id: int, embedding: list):
    db_job = get_job(db, job_id)
    if db_job:
        db_job.embedding = json.dumps(embedding)
        db.commit()
        db.refresh(db_job)
    return db_job

# Score CRUD
def create_score(db: Session, candidate_id: int, job_id: int, score_value: float):
    db_score = Score(
        candidate_id=candidate_id,
        job_id=job_id,
        score=score_value
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_scores_for_job(db: Session, job_id: int, skip: int = 0, limit: int = 100):
    return db.query(Score).filter(Score.job_id == job_id).offset(skip).limit(limit).all()
