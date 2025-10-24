from typing import Optional
from sqlmodel import Session, select
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for User model with custom queries."""

    def __init__(self, session: Session):
        super().__init__(User, session)

    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        statement = select(User).where(User.username == username)
        return self.session.exec(statement).first()

    def email_exists(self, email: str) -> bool:
        """Check if email already exists."""
        return self.get_by_email(email) is not None

    def username_exists(self, username: str) -> bool:
        """Check if username already exists."""
        return self.get_by_username(username) is not None
