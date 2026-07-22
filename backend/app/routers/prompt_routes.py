from fastapi import APIRouter, Depends

from app.ai import generate_lead_in_phrases
from app.auth import get_current_user
from app.models import User
from app.prompts import TEMPLATES, EMOTION_ORDER
from app.schemas import PromptGenerateRequest, PromptGenerateResponse

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.get("/emotions")
def list_emotions():
    """Returns the ordered emotion stages with their base descriptions."""
    return [
        {"emotion": e, "description": TEMPLATES[e]["description"]}
        for e in EMOTION_ORDER
    ]


@router.post("/generate", response_model=PromptGenerateResponse)
def generate(payload: PromptGenerateRequest, user: User = Depends(get_current_user)):
    phrases, source = generate_lead_in_phrases(payload.emotion, payload.context)
    return PromptGenerateResponse(emotion=payload.emotion, lead_in_phrases=phrases, source=source)
