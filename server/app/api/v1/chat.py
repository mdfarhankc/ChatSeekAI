from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from uuid import UUID
from app.core.database import SessionDep
from app.models.user import User
from app.schemas.chat import (
    ChatCreate,
    ChatUpdate,
    ChatResponse,
    ChatListResponse
)
from app.services.chat_service import ChatService
from app.core.dependencies import CurrentUserDep
import math

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
def create_chat(
    chat_data: ChatCreate,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Create a new chat."""
    chat_service = ChatService(session)
    chat = chat_service.create_chat(chat_data, current_user)

    # Add message count
    message_count = chat_service.get_message_count(chat.id)

    response = ChatResponse.model_validate(chat)
    response.message_count = message_count

    return response


@router.get("", response_model=ChatListResponse)
def get_chats(
    session: SessionDep,
    current_user: CurrentUserDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """Get paginated list of user's chats."""
    chat_service = ChatService(session)
    chats, total = chat_service.get_user_chats(current_user, page, page_size)

    # Add message counts
    chat_responses = []
    for chat in chats:
        response = ChatResponse.model_validate(chat)
        response.message_count = chat_service.get_message_count(chat.id)
        chat_responses.append(response)

    return ChatListResponse(
        items=chat_responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0
    )


@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat(
    chat_id: UUID,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Get a specific chat by ID."""
    chat_service = ChatService(session)
    chat = chat_service.get_chat(chat_id, current_user)

    response = ChatResponse.model_validate(chat)
    response.message_count = chat_service.get_message_count(chat.id)

    return response


@router.put("/{chat_id}", response_model=ChatResponse)
def update_chat(
    chat_id: UUID,
    chat_data: ChatUpdate,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Update a chat."""
    chat_service = ChatService(session)
    chat = chat_service.update_chat(chat_id, chat_data, current_user)

    response = ChatResponse.model_validate(chat)
    response.message_count = chat_service.get_message_count(chat.id)

    return response


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(
    chat_id: UUID,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Delete a chat."""
    chat_service = ChatService(session)
    chat_service.delete_chat(chat_id, current_user)
    return None
