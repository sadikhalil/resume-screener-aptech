from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db.database   import get_db
from db.models.job import Job

router = APIRouter()


class JobCreate(BaseModel):
    title:           str
    description:     str
    required_skills: list  = []
    required_edu:    str   = "bachelor"
    required_exp:    int   = 0


@router.post("/")
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    """Create a new job description."""
    job = Job(
        title           = payload.title,
        description     = payload.description,
        required_skills = payload.required_skills,
        required_edu    = payload.required_edu,
        required_exp    = payload.required_exp,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    """List all job descriptions."""
    return db.query(Job).order_by(Job.created_at.desc()).all()


@router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a single job by ID."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/{job_id}")
def update_job(job_id: int, payload: JobCreate, db: Session = Depends(get_db)):
    """Update an existing job description."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.title           = payload.title
    job.description     = payload.description
    job.required_skills = payload.required_skills
    job.required_edu    = payload.required_edu
    job.required_exp    = payload.required_exp
    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    """Delete a job and all its associated scores."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": f"Job '{job.title}' deleted successfully"}
