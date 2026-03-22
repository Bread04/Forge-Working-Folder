def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200):
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def parse_pdf(pdf_path: str) -> list[str]:
    """ Extracts text from a PDF and returns it as a list of text chunks. """
    import fitz  # PyMuPDF
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return chunk_text(full_text)
