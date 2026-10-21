import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.config import settings

ALGORITHM = "HS256"


def password_to_bytes(password: str):
    # bcrypt учитывает только первые 72 байта пароля
    return password.encode()[:72]


def hash_password(password: str):
    return bcrypt.hashpw(password_to_bytes(password), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str):
    return bcrypt.checkpw(password_to_bytes(password), password_hash.encode())


def create_access_token(user_id: int):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_minutes
    )
    payload = {"sub": str(user_id), "exp": expires}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str):
    payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    return int(payload["sub"])


def create_refresh_token():
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()
