from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ChatBase(BaseModel):
    """Base chat schema."""
    title: str = Field(max_length=255)
    model: str = Field(default="llama2", max_length=100)
    system_prompt: Optional[str] = None


class ChatCreate(ChatBase):
    """Schema for creating a new chat."""
    pass


class ChatUpdate(BaseModel):
    """Schema for updating a chat."""
    title: Optional[str] = Field(None, max_length=255)
    model: Optional[str] = Field(None, max_length=100)
    system_prompt: Optional[str] = None


class ChatResponse(ChatBase):
    """Schema for chat response."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class ChatListResponse(BaseModel):
    """Schema for paginated chat list."""
    items: list[ChatResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
