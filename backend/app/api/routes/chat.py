from fastapi import APIRouter
from app.services.gemini import chat_with_scholar
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    response = await chat_with_scholar(request.message, request.history)
    return {"response": response}
