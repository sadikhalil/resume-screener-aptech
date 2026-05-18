from sentence_transformers import SentenceTransformer
from config import settings

# Load model once — not on every request (saves time)
_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def embed(text: str):
    """Convert a single text string into a numeric vector (embedding)."""
    model = get_model()
    return model.encode([text])[0]


def embed_batch(texts: list):
    """Convert multiple texts into embeddings at once — faster than one by one."""
    model = get_model()
    return model.encode(texts)
