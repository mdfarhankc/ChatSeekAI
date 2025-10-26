from fastapi import APIRouter
from typing import List
from app.schemas.ollama import (
    ModelResponse
)
from app.services.ollama_service import OllamaService

router = APIRouter(prefix="/ollama", tags=["Ollama"])

@router.get("/models", response_model=List[ModelResponse])
async def get_ollama_models():
    """Get all available ollama models."""
    ollama_service = OllamaService()
    models = await ollama_service.list_models()
    print("Modrlks: ", models)
    return models