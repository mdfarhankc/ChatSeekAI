from uuid import UUID
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)) -> str:
    """Create JWT access token with 1 hour as expiry."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "type": "access"})

    # Convert UUID to string if present
    if "sub" in to_encode and isinstance(to_encode["sub"], UUID):
        to_encode["sub"] = str(to_encode["sub"])

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)) -> str:
    """Create JWT refresh token with 30 days as expiry."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "type": "refresh"})

    # Convert UUID to string if present
    if "sub" in to_encode and isinstance(to_encode["sub"], UUID):
        to_encode["sub"] = str(to_encode["sub"])

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
