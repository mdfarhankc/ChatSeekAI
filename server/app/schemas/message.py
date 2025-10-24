from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from uuid import UUID
from app.models.message import MessageRole


class MessageBase(BaseModel):
    """Base message schema."""
    content: str = Field(min_length=1)


class MessageCreate(MessageBase):
    """Schema for creating a message."""
    role: MessageRole = MessageRole.USER


class MessageResponse(MessageBase):
    """Schema for message response."""
    id: UUID
    chat_id: UUID
    role: MessageRole
    tokens: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StreamMessageRequest(BaseModel):
    """Schema for streaming message request."""
    message: str = Field(min_length=1)
    chat_id: UUID


class MessageListResponse(BaseModel):
    """Schema for message list response."""
    items: list[MessageResponse]
    total: int
