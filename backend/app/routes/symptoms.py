from fastapi import APIRouter, Depends
from ..schemas.ai import SymptomAnalysisRequest, SymptomAnalysisResponse, ChatRequest, ChatResponse
from ..services.ai_service import analyze_symptoms, chat as ai_chat
from ..core.dependencies import get_current_user
from typing import Any

# `get_current_user` currently returns a dict-like user object from instantdb,
# so use a generic `Any` type here instead of importing a missing `User` model.
User = Any

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/symptoms", response_model=SymptomAnalysisResponse)
async def symptom_analysis(req: SymptomAnalysisRequest, _: User = Depends(get_current_user)):
    return await analyze_symptoms(req.symptoms, req.tags, req.age, req.gender)


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, _: User = Depends(get_current_user)):
    return await ai_chat(req.messages)
