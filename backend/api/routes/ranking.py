from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database          import get_db
from db.models.job        import Job
from core.matching.ranker import get_ranked_candidates

router = APIRouter()


@router.get("/")
def rank_candidates(job_id: int, db: Session = Depends(get_db)):
    """
    Return all candidates ranked by score for a specific job.

    Usage:  GET /api/rank?job_id=1
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Job ID {job_id} not found.")

    ranked = get_ranked_candidates(db, job_id)

    return {
        "job_id":     job_id,
        "job_title":  job.title,
        "total":      len(ranked),
        "candidates": ranked,
    }
