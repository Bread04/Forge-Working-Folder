from fastapi import APIRouter, UploadFile, File
from app.services.chunking import parse_pdf
from app.services.gemini import generate_v2_tree
import os

router = APIRouter()

@router.post("/extract-graph")
async def extract_graph(file: UploadFile = File(...)):
    # Save file temporarily
    file_path = f"tmp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # Parse PDF text
    text = parse_pdf(file_path)
    
    # Generate V2 Tree Graph in a single pass
    tree_data = await generate_v2_tree(text)
    
    # Clean up
    os.remove(file_path)
    
    return tree_data
