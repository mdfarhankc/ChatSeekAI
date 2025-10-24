from typing import Optional
from sqlmodel import Session, select, func
from app.models.chat import Chat
from app.models.message import Message
from app.repositories.base_repository import BaseRepository
from uuid import UUID


class ChatRepository(BaseRepository[Chat]):
    """Repository for Chat model with custom queries."""

    def __init__(self, session: Session):
        super().__init__(Chat, session)

    def get_user_chats(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> list[Chat]:
        """Get all chats for a specific user."""
        statement = (
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(Chat.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def count_user_chats(self, user_id: UUID) -> int:
        """Count total chats for a user."""
        statement = select(func.count()).select_from(
            Chat).where(Chat.user_id == user_id)
        return self.session.exec(statement).one()

    def get_chat_with_messages(self, chat_id: UUID) -> Optional[Chat]:
        """Get chat with all its messages."""
        statement = select(Chat).where(Chat.id == chat_id)
        chat = self.session.exec(statement).first()

        if chat:
            # Load messages explicitly
            message_statement = (
                select(Message)
                .where(Message.chat_id == chat_id)
                .order_by(Message.created_at)
            )
            chat.messages = list(self.session.exec(message_statement).all())

        return chat

    def get_by_id_and_user(self, chat_id: UUID, user_id: UUID) -> Optional[Chat]:
        """Get chat by ID ensuring it belongs to the user."""
        statement = select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id
        )
        return self.session.exec(statement).first()
