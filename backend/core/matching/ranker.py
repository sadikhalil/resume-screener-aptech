from sqlalchemy.orm import Session
from db.models.score     import Score
from db.models.candidate import Candidate


def get_ranked_candidates(db: Session, job_id: int) -> list:
    """
    Fetch all candidates scored for a specific job, sorted best to worst.
    Returns a list of dicts with candidate info + score + rank number.
    """
    results = (
        db.query(Score, Candidate)
        .join(Candidate, Score.candidate_id == Candidate.id)
        .filter(Score.job_id == job_id)
        .order_by(Score.final_score.desc())
        .all()
    )

    ranked = []
    for rank, (score, candidate) in enumerate(results, start=1):
        ranked.append({
            "rank":         rank,
            "candidate_id": candidate.id,
            "name":         candidate.name,
            "email":        candidate.email,
            "phone":        candidate.phone,
            "skills":       candidate.skills,
            "experience":   candidate.experience,
            "education":    candidate.education,
            "final_score":  score.final_score,
            "breakdown":    score.breakdown,
            "applied_at":   str(score.created_at),
        })

    return ranked
