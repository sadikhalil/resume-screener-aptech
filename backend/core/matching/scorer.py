from sklearn.metrics.pairwise import cosine_similarity
from core.nlp.embedder import embed

# Education levels — higher number = higher degree
EDUCATION_LEVELS = {
    "high school": 1,
    "diploma":     2,
    "bachelor":    3,
    "master":      4,
    "phd":         5,
}

# Score weights — must add up to 1.0
WEIGHTS = {
    "semantic":   0.50,   # How similar the resume is to the job description
    "skills":     0.30,   # How many required skills are matched
    "experience": 0.10,   # Years of experience vs required
    "education":  0.10,   # Education level vs required
}


def semantic_score(resume_text: str, job_description: str) -> float:
    """Compare resume and job description meaning using cosine similarity."""
    resume_emb = embed(resume_text).reshape(1, -1)
    job_emb    = embed(job_description).reshape(1, -1)
    score = cosine_similarity(resume_emb, job_emb)[0][0]
    return float(round(score, 4))


def skills_score(resume_skills: list, job_skills: list) -> float:
    """Fraction of required job skills found in the resume (0.0 to 1.0)."""
    if not job_skills:
        return 1.0
    resume_set = set(s.lower() for s in resume_skills)
    job_set    = set(s.lower() for s in job_skills)
    matched    = resume_set.intersection(job_set)
    return round(len(matched) / len(job_set), 4)


def experience_score(candidate_years: int, required_years: int) -> float:
    """Score based on years of experience vs job requirement (0.0 to 1.0)."""
    if required_years == 0:
        return 1.0
    if candidate_years >= required_years:
        return 1.0
    return round(candidate_years / required_years, 4)


def education_score(candidate_edu: str, required_edu: str) -> float:
    """Score based on education level vs job requirement (0.0 to 1.0)."""
    c_level = EDUCATION_LEVELS.get((candidate_edu or "").lower(), 0)
    r_level = EDUCATION_LEVELS.get((required_edu  or "").lower(), 0)
    if c_level >= r_level:
        return 1.0
    return 0.5  # Partial score if below requirement


def calculate_score(
    resume_text:     str,
    job_description: str,
    resume_skills:   list,
    job_skills:      list,
    candidate_years: int,
    required_years:  int,
    candidate_edu:   str,
    required_edu:    str,
) -> dict:
    """
    Calculate final weighted ranking score for a candidate against a job.

    Returns:
        final_score: 0–100 number
        breakdown:   individual component scores (0.0–1.0 each)
    """
    s1 = semantic_score(resume_text, job_description)
    s2 = skills_score(resume_skills, job_skills)
    s3 = experience_score(candidate_years, required_years)
    s4 = education_score(candidate_edu, required_edu)

    final = (
        s1 * WEIGHTS["semantic"]   +
        s2 * WEIGHTS["skills"]     +
        s3 * WEIGHTS["experience"] +
        s4 * WEIGHTS["education"]
    )

    return {
        "final_score": round(final * 100, 2),
        "breakdown": {
            "semantic":   s1,
            "skills":     s2,
            "experience": s3,
            "education":  s4,
        }
    }
