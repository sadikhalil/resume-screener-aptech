import json
import os

# Load master skills list from taxonomy file
TAXONOMY_PATH = os.path.join(os.path.dirname(__file__), "../../ml/skills_taxonomy.json")

try:
    with open(TAXONOMY_PATH, "r") as f:
        SKILLS_TAXONOMY = [skill.lower() for skill in json.load(f)]
except FileNotFoundError:
    # Fallback list if taxonomy file is missing
    SKILLS_TAXONOMY = [
        "python", "javascript", "typescript", "java", "c++", "react", "vue",
        "angular", "fastapi", "django", "flask", "node.js", "postgresql",
        "mysql", "mongodb", "docker", "kubernetes", "aws", "git", "sql",
        "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
        "pandas", "numpy", "scikit-learn", "html", "css", "tailwind",
    ]


def extract_skills(text: str) -> list:
    """
    Scan resume text and return skills found in the taxonomy.
    Uses whole-word matching to avoid false positives.
    """
    text_lower = text.lower()
    found = []

    for skill in SKILLS_TAXONOMY:
        # Pad with spaces for whole-word matching
        if f" {skill} " in f" {text_lower} ":
            found.append(skill.title())

    return sorted(set(found))


def match_skills(resume_skills: list, job_skills: list) -> dict:
    """
    Compare resume skills against job required skills.
    Returns matched, missing, and a 0.0–1.0 overlap score.
    """
    resume_set = set(s.lower() for s in resume_skills)
    job_set    = set(s.lower() for s in job_skills)

    matched = resume_set.intersection(job_set)
    missing = job_set.difference(resume_set)
    score   = len(matched) / len(job_set) if job_set else 0.0

    return {
        "matched": list(matched),
        "missing": list(missing),
        "score":   round(score, 4),
    }
