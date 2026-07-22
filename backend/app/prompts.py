"""
Static seed data for the guided Love Letter format described in the book:
each letter moves through five emotional stages, ending in love and a wish.
These are the fallback lead-in phrases used when no AI key is configured,
and also the base material the AI is prompted to personalize.
"""

TEMPLATES = {
    "anger": {
        "description": "Say what frustrates or angers you about the situation.",
        "lead_in_phrases": [
            "I am angry that...",
            "I am frustrated that...",
            "I am annoyed that...",
            "I want...",
        ],
    },
    "hurt": {
        "description": "Say what feels sad or hurtful underneath the anger.",
        "lead_in_phrases": [
            "I feel hurt that...",
            "I feel sad that...",
            "I feel disappointed that...",
            "I wanted...",
        ],
    },
    "fear": {
        "description": "Say what you're afraid of, or what worries you.",
        "lead_in_phrases": [
            "I feel afraid that...",
            "I feel scared that...",
            "I feel worried that...",
            "I need...",
        ],
    },
    "regret": {
        "description": "Say what you regret, or wish you'd done differently.",
        "lead_in_phrases": [
            "I feel sorry that...",
            "I feel embarrassed that...",
            "I feel ashamed that...",
            "I want to change...",
        ],
    },
    "love": {
        "description": "Say what you love, understand, or appreciate, and what you wish for.",
        "lead_in_phrases": [
            "I love...",
            "I understand...",
            "I appreciate...",
            "I know...",
            "I wish...",
        ],
    },
}

EMOTION_ORDER = ["anger", "hurt", "fear", "regret", "love"]
