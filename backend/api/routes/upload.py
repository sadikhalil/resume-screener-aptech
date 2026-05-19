import logging
import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database            import get_db
from db.models.candidate    import Candidate
from db.models.score        import Score
from db.models.job          import Job
from core.parsers.extractor import extract_text
from core.nlp.extractor     import process_resume
from core.matching.scorer   import calculate_score
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".ppt", ".pptx"}


@router.post("/")
async def upload_resume(
    file:   UploadFile = File(...),
    job_id: int        = Form(...),
    db:     Session    = Depends(get_db),
):
    """
    Upload a resume (PDF / DOCX / PPTX), extract text, run NLP pipeline,
    calculate match score against the job, and save everything to the database.
    """
    # 1. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: PDF, DOCX, PPTX"
        )

    # 2. Check the job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Job ID {job_id} not found.")

    # 3. Save uploaded file to the uploads folder
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Extract raw text from the file
    try:
        raw_text = extract_text(file_path)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Resume text extraction failed for file: %s", file_path)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                logger.warning("Failed to remove invalid upload: %s", file_path)
        raise HTTPException(
            status_code=422,
            detail="Could not process the uploaded file. Please upload a valid resume document."
        )

    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="No text found in the uploaded file.")

    # 5. Run the full NLP pipeline
    try:
        nlp_data = process_resume(raw_text)
    except Exception as e:
        logger.exception("NLP processing failed for uploaded resume: %s", file_path)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                logger.warning("Failed to remove uploaded file after NLP failure: %s", file_path)
        raise HTTPException(
            status_code=422,
            detail="Unable to analyze the resume at this time. Please try a different file."
        )

    # 6. Save candidate to the database
    candidate = Candidate(
        name        = nlp_data.get("name") or "Unknown",
        email       = nlp_data.get("email") or f"unknown_{file.filename}",
        phone       = nlp_data.get("phone"),
        skills      = nlp_data.get("skills", []),
        resume_text = raw_text,
        file_path   = file_path,
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    # 7. Calculate the matching score
    result = calculate_score(
        resume_text     = nlp_data["cleaned_text"],
        job_description = job.description,
        resume_skills   = nlp_data["skills"],
        job_skills      = job.required_skills or [],
        candidate_years = candidate.experience or 0,
        required_years  = job.required_exp    or 0,
        candidate_edu   = candidate.education  or "bachelor",
        required_edu    = job.required_edu     or "bachelor",
    )

    # 8. Save score to the database
    score = Score(
        candidate_id = candidate.id,
        job_id       = job_id,
        final_score  = result["final_score"],
        breakdown    = result["breakdown"],
    )
    db.add(score)
    db.commit()

    return {
        "message":      "Resume uploaded and scored successfully",
        "candidate_id": candidate.id,
        "name":         candidate.name,
        "email":        candidate.email,
        "skills":       candidate.skills,
        "final_score":  result["final_score"],
        "breakdown":    result["breakdown"],
    }
