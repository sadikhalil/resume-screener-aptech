from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database         import get_db
from db.models.score     import Score
from db.models.candidate import Candidate
from db.models.job       import Job

router = APIRouter()


@router.get("/overview")
def analytics_overview(db: Session = Depends(get_db)):
    """
    Return high-level stats for the analytics dashboard:
    - Total candidates
    - Total scores calculated
    - Average score across all candidates
    - Top score achieved
    - Score distribution in 4 buckets (0-25, 25-50, 50-75, 75-100)
    """
    total_candidates = db.query(Candidate).count()
    total_jobs       = db.query(Job).count()
    total_scores     = db.query(Score).count()
    avg_score        = db.query(func.avg(Score.final_score)).scalar() or 0
    top_score        = db.query(func.max(Score.final_score)).scalar() or 0

    # Build score distribution buckets
    all_scores = [s.final_score for s in db.query(Score).all()]
    distribution = {
        "0-25":   sum(1 for s in all_scores if s < 25),
        "25-50":  sum(1 for s in all_scores if 25 <= s < 50),
        "50-75":  sum(1 for s in all_scores if 50 <= s < 75),
        "75-100": sum(1 for s in all_scores if s >= 75),
    }

    # Top 5 candidates by score
    top_candidates = (
        db.query(Score, Candidate)
        .join(Candidate, Score.candidate_id == Candidate.id)
        .order_by(Score.final_score.desc())
        .limit(5)
        .all()
    )

    top_list = [
        {
            "name":        c.name,
            "email":       c.email,
            "final_score": s.final_score,
        }
        for s, c in top_candidates
    ]

    return {
        "total_candidates": total_candidates,
        "total_jobs":       total_jobs,
        "total_scored":     total_scores,
        "average_score":    round(float(avg_score), 2),
        "top_score":        round(float(top_score), 2),
        "distribution":     distribution,
        "top_candidates":   top_list,
    }
