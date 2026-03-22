import os
from openai import AsyncOpenAI
from app.core.config import settings

# Initialize the AsyncOpenAI client
# It automatically picks up OPENAI_API_KEY from the environment/settings
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_bridge_explanation(concept: str, transcript: str) -> str:
    prompt = f"""
    The student is struggling to understand the concept of '{concept}' from their notes. 
    Here is a transcript snippet from a helpful video:
    
    "{transcript}"
    
    Explain the concept using the video's logic and analogy, but keep it concise and consistent with the student's terminology.
    """
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a highly adaptable academic tutor."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]

async def chat_with_scholar_rag(message: str, history: list[dict], context_nodes: list[dict]) -> str:
    # Build robust RAG Context string
    context_str = "No specific structural graph knowledge found in memory."
    if context_nodes and len(context_nodes) > 0:
        context_str = "\n\n".join([f"Node Title: {n['title']}\nContent: {n['content_markdown']}\nIntuition Analytics: {n['zero_g_intuition']}" for n in context_nodes])
    
    system_prompt = f"""You are Scholar AI, an elite, hyper-intelligent learning tutor integrated into the FocusFlow ecosystem.
Use the following retrieved knowledge nodes from the user's graph memory to answer their query.
If the context contains the answer, anchor your explanation in it. 
If the context is insufficient, provide a general answer but explicitly mention that this expands beyond their mapped skill tree.
Maintain the persona of a sharp, slightly intense, highly effective mentor.

CURRENT GRAPH MEMORY (Nodes Retreived via Similarity Search):
{context_str}
"""
    messages = [{"role": "system", "content": system_prompt}]
    
    for h in history:
        role = "assistant" if h.get("role") == "model" else "user"
        messages.append({"role": role, "content": h.get("content", "")})
        
    messages.append({"role": "user", "content": message})
    
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    return response.choices[0].message.content
