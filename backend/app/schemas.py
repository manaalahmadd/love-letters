from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr


# ---- Auth ----

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    display_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---- Prompts ----

class PromptTemplateOut(BaseModel):
    id: str
    emotion: str
    lead_in_phrases: List[str]
    description: Optional[str] = None


class PromptGenerateRequest(BaseModel):
    emotion: str
    context: Optional[str] = None  # short freeform description of the situation


class PromptGenerateResponse(BaseModel):
    emotion: str
    lead_in_phrases: List[str]
    source: str  # "ai" or "template_fallback"


# ---- Letters ----

class LetterCreate(BaseModel):
    emotion_tag: str
    title: Optional[str] = None
    content: str


class LetterOut(BaseModel):
    id: str
    emotion_tag: str
    title: Optional[str] = None
    content: str
    created_at: datetime
    resurfaced_at: Optional[datetime] = None
    is_archived: bool

    class Config:
        from_attributes = True


class LetterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_archived: Optional[bool] = None


# ---- Mood ----

class MoodLogCreate(BaseModel):
    wave_position: str
    note: Optional[str] = None


class MoodLogOut(BaseModel):
    id: str
    wave_position: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
