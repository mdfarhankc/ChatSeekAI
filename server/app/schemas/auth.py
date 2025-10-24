from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token data schema for JWT payload."""
    user_id: Optional[UUID] = None
    username: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str
