import re
import spacy
from config import settings

# Load spaCy model once at startup
nlp = spacy.load(settings.SPACY_MODEL)

def extract_entities(text: str) -> dict:
    """
    Use spaCy NER to extract structured info from resume text.
    Returns: name, email, phone, organizations, locations, dates
    """
    doc = nlp(text)

    entities = {
        "name":          None,
        "email":         None,
        "phone":         None,
        "organizations": [],
        "dates":         [],
        "locations":     [],
    }

    # Email — regex is more reliable than NER for this
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    if email_match:
        entities["email"] = email_match.group()

    # Phone — regex
    phone_match = re.search(r"(\+?\d[\d\s\-\(\)]{7,15}\d)", text)
    if phone_match:
        entities["phone"] = phone_match.group().strip()

    # spaCy NER for name, org, location, date
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not entities["name"]:
            entities["name"] = ent.text

        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)

        elif ent.label_ == "DATE":
            entities["dates"].append(ent.text)

        elif ent.label_ in ["GPE", "LOC"]:
            entities["locations"].append(ent.text)

    return entities
