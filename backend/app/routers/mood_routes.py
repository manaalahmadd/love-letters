from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User, MoodLog
from app.schemas import MoodLogCreate, MoodLogOut

router = APIRouter(prefix="/moods", tags=["moods"])


@router.post("", response_model=MoodLogOut)
def log_mood(payload: MoodLogCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mood = MoodLog(user_id=user.id, wave_position=payload.wave_position, note=payload.note)
    db.add(mood)
    db.commit()
    db.refresh(mood)
    return mood


@router.get("", response_model=List[MoodLogOut])
def list_moods(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(MoodLog)
        .filter(MoodLog.user_id == user.id)
        .order_by(MoodLog.created_at.desc())
        .limit(90)
        .all()
    )
