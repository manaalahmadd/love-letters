from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.encryption import encrypt_text, decrypt_text
from app.models import User, Letter
from app.schemas import LetterCreate, LetterOut, LetterUpdate

router = APIRouter(prefix="/letters", tags=["letters"])

RESURFACE_AFTER_DAYS = 30  # tune later; could be per-user configurable


def _to_out(letter: Letter) -> LetterOut:
    return LetterOut(
        id=letter.id,
        emotion_tag=letter.emotion_tag,
        title=letter.title,
        content=decrypt_text(letter.content_encrypted),
        created_at=letter.created_at,
        resurfaced_at=letter.resurfaced_at,
        is_archived=letter.is_archived,
    )


@router.post("", response_model=LetterOut)
def create_letter(payload: LetterCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    letter = Letter(
        user_id=user.id,
        emotion_tag=payload.emotion_tag,
        title=payload.title,
        content_encrypted=encrypt_text(payload.content),
        resurface_eligible_at=datetime.utcnow() + timedelta(days=RESURFACE_AFTER_DAYS),
    )
    db.add(letter)
    db.commit()
    db.refresh(letter)
    return _to_out(letter)


@router.get("", response_model=List[LetterOut])
def list_letters(
    include_archived: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Letter).filter(Letter.user_id == user.id)
    if not include_archived:
        q = q.filter(Letter.is_archived == False)  # noqa: E712
    letters = q.order_by(Letter.created_at.desc()).all()
    return [_to_out(l) for l in letters]


@router.get("/resurfaced", response_model=List[LetterOut])
def get_resurfaced(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Letters that have crossed their resurface date and haven't been shown yet."""
    now = datetime.utcnow()
    letters = (
        db.query(Letter)
        .filter(
            Letter.user_id == user.id,
            Letter.resurface_eligible_at <= now,
            Letter.resurfaced_at.is_(None),
            Letter.is_archived == False,  # noqa: E712
        )
        .all()
    )
    return [_to_out(l) for l in letters]


@router.post("/{letter_id}/acknowledge-resurface", response_model=LetterOut)
def acknowledge_resurface(letter_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id, Letter.user_id == user.id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    letter.resurfaced_at = datetime.utcnow()
    db.commit()
    db.refresh(letter)
    return _to_out(letter)


@router.get("/{letter_id}", response_model=LetterOut)
def get_letter(letter_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id, Letter.user_id == user.id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return _to_out(letter)


@router.patch("/{letter_id}", response_model=LetterOut)
def update_letter(letter_id: str, payload: LetterUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id, Letter.user_id == user.id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if payload.title is not None:
        letter.title = payload.title
    if payload.content is not None:
        letter.content_encrypted = encrypt_text(payload.content)
    if payload.is_archived is not None:
        letter.is_archived = payload.is_archived
    db.commit()
    db.refresh(letter)
    return _to_out(letter)


@router.delete("/{letter_id}")
def delete_letter(letter_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id, Letter.user_id == user.id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    db.delete(letter)
    db.commit()
    return {"ok": True}
