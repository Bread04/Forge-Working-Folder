from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.openai_client import generate_bridge_explanation

router = APIRouter()

class BridgeRequest(BaseModel):
    concept: str

class BridgeResponse(BaseModel):
    explanation: str
    videoUrl: str
    timestamp: str

# Mocked YouTube data for demonstration purposes
MOCK_VIDEO_DATA = {
    "Calculus Pulse": {
        "transcript": "So when we look at the area under this curve, we're basically adding up all these tiny little rectangles. The thinner the rectangle, the closer we get to the actual area. That's the pulse of integration.",
        "url": "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        "timestamp": "125" # 2 minutes 5 seconds
    },
    "Neural Analogy": {
        "transcript": "Think of a neural network like a series of water pipes. If you turn on the tap, water flows through the paths of least resistance. The weights are just valves controlling that flow.",
        "url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "timestamp": "42"
    },
    "default": {
        "transcript": "Let's simplify this. It's really about breaking a big problem down into smaller, solvable pieces, just like sorting a messy room one corner at a time.",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "timestamp": "0"
    }
}

@router.post("/bridge-gap", response_model=BridgeResponse)
async def bridge_gap(request: BridgeRequest):
    concept = request.concept
    
    # Simple logic to pick mock data based on concept name
    mock_data = MOCK_VIDEO_DATA.get("default")
    for key in MOCK_VIDEO_DATA.keys():
        if key.lower() in concept.lower():
            mock_data = MOCK_VIDEO_DATA[key]
            break
            
    # Generate the bridge explanation using Gemini
    explanation = await generate_bridge_explanation(concept, mock_data["transcript"])
    
    return BridgeResponse(
        explanation=explanation,
        videoUrl=mock_data["url"],
        timestamp=mock_data["timestamp"]
    )
