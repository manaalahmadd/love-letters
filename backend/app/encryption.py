"""
Encrypts letter content at rest using Fernet (symmetric AES).

Generate a key once with:
    python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
and put it in .env as LETTER_ENCRYPTION_KEY.
"""
from cryptography.fernet import Fernet

from app.config import settings

_fernet: Fernet | None = None


def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        key = settings.letter_encryption_key
        if not key:
            # Dev fallback only — always set a real key before deploying.
            key = Fernet.generate_key().decode()
        _fernet = Fernet(key.encode() if isinstance(key, str) else key)
    return _fernet


def encrypt_text(plain: str) -> str:
    return _get_fernet().encrypt(plain.encode()).decode()


def decrypt_text(token: str) -> str:
    return _get_fernet().decrypt(token.encode()).decode()
