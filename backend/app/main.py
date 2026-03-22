from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import extract, chat, focus, bridge, trees
from app.core.config import settings

app = FastAPI(title="FocusFlow AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(extract.router, prefix="/api", tags=["extract"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(focus.router, prefix="/api", tags=["focus"])
app.include_router(bridge.router, prefix="/api", tags=["bridge"])
app.include_router(trees.router, prefix="/api/trees", tags=["trees"])

@app.get("/")
async def root():
    return {"message": "FocusFlow AI API is running"}
