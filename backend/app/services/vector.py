import os
from supabase import create_client, Client
from app.core.config import settings
import numpy as np

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

async def store_embeddings(chunks: list, embeddings: list, document_id: str):
    data = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        data.append({
            "document_id": document_id,
            "content": chunk,
            "embedding": embedding,
            "metadata": {"chunk_index": i}
        })
    
    result = supabase.table("embeddings").insert(data).execute()
    return result

async def query_vector_search(query_embedding: list, top_k: int = 5):
    # This assumes a RPC function 'match_embeddings' defined in Supabase
    result = supabase.rpc("match_embeddings", {
        "query_embedding": query_embedding,
        "match_threshold": 0.5,
        "match_count": top_k
    }).execute()
    return result.data
