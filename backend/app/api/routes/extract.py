from fastapi import APIRouter, UploadFile, File
from app.services.chunking import parse_pdf
from app.services.openai_schema_extract import extract_graph_with_openai
from app.services.openai_client import generate_embeddings
from app.services.vector import store_graph_in_db
import os

router = APIRouter()

@router.post("/extract-graph")
async def extract_graph(file: UploadFile = File(...)):
    # Save file temporarily
    file_path = f"tmp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # Parse PDF
    text_chunks = parse_pdf(file_path)
    
    # Generate Graph using OpenAI Structured Outputs
    extracted_data = await extract_graph_with_openai(text_chunks)
    
    # Clean up
    os.remove(file_path)
    
    # Embed all nodes for RAG capabilities
    if not extracted_data.nodes:
        return {
            "tree_id": None,
            "documentTitle": extracted_data.document_title,
            "nodes": [],
            "edges": []
        }

    texts_to_embed = [f"Title: {n.title}\n{n.content_markdown}" for n in extracted_data.nodes]
    embeddings = await generate_embeddings(texts_to_embed)

    # Store Graph into Neo-RAG Relational DB
    tree_id = store_graph_in_db(extracted_data.document_title, extracted_data, embeddings)

    return {
        "tree_id": tree_id,
        "documentTitle": extracted_data.document_title, 
        "nodes": [node.model_dump() for node in extracted_data.nodes], 
        "edges": [edge.model_dump() for edge in extracted_data.edges]
    }
