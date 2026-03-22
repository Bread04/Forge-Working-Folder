from fastapi import APIRouter
from app.services.openai_client import chat_with_scholar_rag, generate_embeddings
from app.services.vector import query_vector_search
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    # 1. Embed user query
    query_embed = await generate_embeddings([request.message])
    
    # 2. Semantic Search across Neo-Graph memory
    context_nodes = query_vector_search(query_embed[0], top_k=3)
    
    # 3. Send query + augmented context to Scholar AI
    response = await chat_with_scholar_rag(request.message, request.history, context_nodes)
    
    return {"response": response}
