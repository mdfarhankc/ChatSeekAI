from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.message import Message


class Chat(SQLModel, table=True):
    """Chat/Conversation model for organizing messages."""

    __tablename__ = "chats"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255)
    model: str = Field(default="llama3", max_length=100)
    system_prompt: Optional[str] = Field(default=None)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    user_id: UUID = Field(foreign_key="users.id", index=True)
    user: "User" = Relationship(back_populates="chats")

    messages: list["Message"] = Relationship(
        back_populates="chat", cascade_delete=True)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "My Conversation",
                "model": "llama3",
                "system_prompt": "You are a helpful assistant."
            }
        }
