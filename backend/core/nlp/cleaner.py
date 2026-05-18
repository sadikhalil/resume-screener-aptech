import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download("punkt",          quiet=True)
nltk.download("punkt_tab",      quiet=True)
nltk.download("stopwords",      quiet=True)

STOP_WORDS = set(stopwords.words("english"))

def clean_text(text: str) -> str:
    """
    Clean raw resume text:
    1. Lowercase
    2. Remove special characters
    3. Remove extra whitespace
    4. Remove stopwords (the, is, at, etc.)
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]

    return " ".join(tokens)
