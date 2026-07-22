import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    letters = relationship("Letter", back_populates="owner", cascade="all, delete-orphan")
    mood_logs = relationship("MoodLog", back_populates="owner", cascade="all, delete-orphan")


class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(String, primary_key=True, default=gen_uuid)
    emotion = Column(String, nullable=False)  # anger, hurt, fear, regret, love
    lead_in_phrases = Column(Text, nullable=False)  # JSON-encoded list of strings
    description = Column(String, nullable=True)


class Letter(Base):
    __tablename__ = "letters"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    emotion_tag = Column(String, nullable=False)
    title = Column(String, nullable=True)
    content_encrypted = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resurfaced_at = Column(DateTime, nullable=True)
    resurface_eligible_at = Column(DateTime, nullable=True)
    is_archived = Column(Boolean, default=False)

    owner = relationship("User", back_populates="letters")


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    wave_position = Column(String, nullable=False)  # e.g. "high", "dip", "rising"
    note = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="mood_logs")
