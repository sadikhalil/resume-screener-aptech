from core.nlp.cleaner  import clean_text
from core.nlp.ner      import extract_entities
from core.nlp.skills   import extract_skills
from core.nlp.embedder import embed


def process_resume(raw_text: str) -> dict:
    """
    Full NLP pipeline for a resume.

    Steps:
      1. Clean the raw text
      2. Extract entities (name, email, phone, orgs)
      3. Extract skills
      4. Generate semantic embedding for matching

    Input:  raw text string from PDF/DOCX/PPT parser
    Output: structured dict with all extracted data
    """
    # Step 1 — Clean text (remove stopwords, lowercase, etc.)
    cleaned = clean_text(raw_text)

    # Step 2 — Named Entity Recognition (use raw text for better accuracy)
    entities = extract_entities(raw_text)

    # Step 3 — Skill extraction
    skills = extract_skills(raw_text)

    # Step 4 — Generate embedding vector for semantic matching
    embedding = embed(cleaned)

    return {
        "name":          entities.get("name"),
        "email":         entities.get("email"),
        "phone":         entities.get("phone"),
        "organizations": entities.get("organizations", []),
        "locations":     entities.get("locations", []),
        "skills":        skills,
        "cleaned_text":  cleaned,
        "embedding":     embedding.tolist(),  # numpy → list for JSON serialization
    }
