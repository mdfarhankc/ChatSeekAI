from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from datetime import datetime, timezone
from uuid import UUID, uuid4
from enum import Enum

if TYPE_CHECKING:
    from app.models.chat import Chat


class MessageRole(str, Enum):
    """Message role enumeration."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Message(SQLModel, table=True):
    """Message model for storing conversation messages."""

    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    role: MessageRole = Field(index=True)
    content: str = Field(nullable=False)
    tokens: int = Field(default=0)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    chat_id: UUID = Field(foreign_key="chats.id", index=True)
    chat: "Chat" = Relationship(back_populates="messages")

    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Hello, how are you?"
            }
        }
