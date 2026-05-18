import fitz  # PyMuPDF

def parse_pdf(file_path: str) -> str:
    """Extract plain text from a PDF file page by page."""
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()
