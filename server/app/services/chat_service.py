from typing import Optional
from datetime import datetime
from sqlmodel import Session
from uuid import UUID
from app.models.chat import Chat
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatUpdate, ChatResponse
from app.repositories.chat_repository import ChatRepository
from app.repositories.message_repository import MessageRepository
from app.utils.exceptions import NotFoundException, ForbiddenException


class ChatService:
    """Service for chat operations."""

    def __init__(self, session: Session):
        self.chat_repo = ChatRepository(session)
        self.message_repo = MessageRepository(session)
        self.session = session

    def create_chat(self, chat_data: ChatCreate, user: User) -> Chat:
        """Create a new chat for user."""
        chat_dict = chat_data.model_dump()
        chat_dict["user_id"] = user.id

        return self.chat_repo.create(chat_dict)

    def get_user_chats(
        self,
        user: User,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[list[Chat], int]:
        """Get paginated chats for user."""
        skip = (page - 1) * page_size
        chats = self.chat_repo.get_user_chats(
            user.id, skip=skip, limit=page_size)
        total = self.chat_repo.count_user_chats(user.id)

        return chats, total

    def get_chat(self, chat_id: UUID, user: User) -> Chat:
        """Get specific chat ensuring user ownership."""
        chat = self.chat_repo.get_by_id_and_user(chat_id, user.id)

        if not chat:
            raise NotFoundException("Chat not found")

        return chat

    def get_chat_with_messages(self, chat_id: UUID, user: User) -> Chat:
        """Get chat with all its messages."""
        chat = self.get_chat(chat_id, user)
        return self.chat_repo.get_chat_with_messages(chat_id)

    def update_chat(
        self,
        chat_id: UUID,
        chat_data: ChatUpdate,
        user: User
    ) -> Chat:
        """Update chat details."""
        chat = self.get_chat(chat_id, user)

        update_dict = chat_data.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()

        updated_chat = self.chat_repo.update(chat_id, update_dict)

        if not updated_chat:
            raise NotFoundException("Chat not found")

        return updated_chat

    def delete_chat(self, chat_id: UUID, user: User) -> bool:
        """Delete a chat."""
        chat = self.get_chat(chat_id, user)
        return self.chat_repo.delete(chat_id)

    def update_chat_timestamp(self, chat_id: UUID) -> None:
        """Update chat's updated_at timestamp."""
        self.chat_repo.update(chat_id, {"updated_at": datetime.utcnow()})

    def get_message_count(self, chat_id: UUID) -> int:
        """Get total message count for a chat."""
        return self.message_repo.count_chat_messages(chat_id)
