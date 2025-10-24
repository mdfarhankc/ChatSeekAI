from sqlmodel import Session, select, func
from app.models.message import Message
from app.repositories.base_repository import BaseRepository
from uuid import UUID


class MessageRepository(BaseRepository[Message]):
    """Repository for Message model with custom queries."""

    def __init__(self, session: Session):
        super().__init__(Message, session)

    def get_chat_messages(
        self,
        chat_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> list[Message]:
        """Get all messages for a specific chat."""
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at)
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def count_chat_messages(self, chat_id: UUID) -> int:
        """Count total messages in a chat."""
        statement = select(func.count()).select_from(
            Message).where(Message.chat_id == chat_id)
        return self.session.exec(statement).one()

    def get_recent_context(self, chat_id: UUID, limit: int = 10) -> list[Message]:
        """Get recent messages for context (for LLM)."""
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        messages = list(self.session.exec(statement).all())
        return list(reversed(messages))  # Return in chronological order
