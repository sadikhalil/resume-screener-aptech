import os
from core.parsers.pdf_parser  import parse_pdf
from core.parsers.docx_parser import parse_docx
from core.parsers.ppt_parser  import parse_ppt

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".doc", ".ppt", ".pptx"}

def extract_text(file_path: str) -> str:
    """
    Detect file type and extract plain text using the correct parser.
    Raises ValueError for unsupported file types.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: '{ext}'. Supported: {', '.join(SUPPORTED_EXTENSIONS)}")

    if ext == ".pdf":
        return parse_pdf(file_path)

    elif ext in [".docx", ".doc"]:
        return parse_docx(file_path)

    elif ext in [".ppt", ".pptx"]:
        return parse_ppt(file_path)
