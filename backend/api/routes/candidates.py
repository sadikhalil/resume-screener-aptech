from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from db.database         import get_db
from db.models.candidate import Candidate
from db.models.score     import Score

router = APIRouter()


@router.get("/")
def list_candidates(db: Session = Depends(get_db)):
    try:
        return db.query(Candidate).order_by(Candidate.created_at.desc()).all()
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database error. Please restart the server.")


@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    try:
        # First delete all scores linked to this candidate
        db.query(Score).filter(Score.candidate_id == candidate_id).delete()

        # Then delete the candidate
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        name = candidate.name
        db.delete(candidate)
        db.commit()
        return {"message": f"Candidate '{name}' deleted successfully"}

    except OperationalError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database is locked. Please try again.")