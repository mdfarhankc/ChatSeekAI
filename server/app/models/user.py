from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from app.models.chat import Chat


class User(SQLModel, table=True):
    """User model for authentication and profile management."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=100)
    full_name: Optional[str] = Field(default=None, max_length=255)
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    chats: list["Chat"] = Relationship(
        back_populates="user", cascade_delete=True)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "johndoe@gmail.com",
                "username": "johndoe",
                "full_name": "John Doe"
            }
        }
