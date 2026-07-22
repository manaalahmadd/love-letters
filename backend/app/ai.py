"""
Wraps the Anthropic API to personalize lead-in phrases for a given emotion
stage, based on the user's short freeform context. Falls back to the static
templates in prompts.py if no API key is configured or the call fails —
the feature should never hard-fail just because AI is unavailable.
"""
import json
from typing import List, Optional

from app.config import settings
from app.prompts import TEMPLATES

try:
    import anthropic
except ImportError:  # pragma: no cover
    anthropic = None


def generate_lead_in_phrases(emotion: str, context: Optional[str] = None) -> tuple[List[str], str]:
    base = TEMPLATES.get(emotion)
    if base is None:
        raise ValueError(f"Unknown emotion: {emotion}")

    if not settings.anthropic_api_key or anthropic is None or not context:
        return base["lead_in_phrases"], "template_fallback"

    try:
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        system_prompt = (
            "You help people write private, guided 'Love Letters' in the format from "
            "John Gray's 'Men Are from Mars, Women Are from Venus'. Given an emotion stage "
            "and a short situation the user describes, rewrite the stage's generic lead-in "
            "phrases so they gently connect to their specific situation, without putting "
            "words in their mouth or writing the letter for them. Return ONLY a JSON array "
            "of 3-5 short lead-in phrase strings, each ending in '...'. No preamble, no markdown."
        )
        user_prompt = (
            f"Emotion stage: {emotion}\n"
            f"Generic lead-ins: {base['lead_in_phrases']}\n"
            f"User's situation: {context}\n"
            "Personalized lead-in phrases (JSON array only):"
        )
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        ).strip()
        text = text.replace("```json", "").replace("```", "").strip()
        phrases = json.loads(text)
        if isinstance(phrases, list) and phrases:
            return phrases, "ai"
        return base["lead_in_phrases"], "template_fallback"
    except Exception:
        return base["lead_in_phrases"], "template_fallback"
