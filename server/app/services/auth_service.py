from sqlmodel import Session
from typing import Optional

from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import Token
from app.repositories.user_repository import UserRepository
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.utils.exceptions import (
    AuthenticationException,
    ConflictException,
    NotFoundException
)


class AuthService:
    """Service for authentication operations following Single Responsibility Principle."""

    def __init__(self, session: Session):
        self.user_repo = UserRepository(session)
        self.session = session

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if email exists
        if self.user_repo.email_exists(user_data.email):
            raise ConflictException("Email already registered")

        # Check if username exists
        if self.user_repo.username_exists(user_data.username):
            raise ConflictException("Username already taken")

        # Create user with hashed password
        user_dict = user_data.model_dump(exclude={"password"})
        user_dict["hashed_password"] = get_password_hash(user_data.password)

        return self.user_repo.create(user_dict)

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username and password."""
        user = self.user_repo.get_by_username(username)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        return user

    def create_tokens(self, user: User) -> Token:
        """Create access and refresh tokens for user."""
        access_token = create_access_token(
            data={"sub": str(user.id), "username": user.username}
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id), "username": user.username}
        )

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    def refresh_access_token(self, refresh_token: str) -> Token:
        """Generate new access token from refresh token."""
        payload = decode_token(refresh_token)

        if not payload or payload.get("type") != "refresh":
            raise AuthenticationException("Invalid refresh token")

        user_id = payload.get("sub")
        if not user_id:
            raise AuthenticationException("Invalid token payload")

        from uuid import UUID
        user = self.user_repo.get_by_id(UUID(user_id))

        if not user or not user.is_active:
            raise NotFoundException("User not found or inactive")

        return self.create_tokens(user)

    def get_current_user(self, token: str) -> User:
        """Get current user from access token."""
        payload = decode_token(token)

        if not payload or payload.get("type") != "access":
            raise AuthenticationException("Invalid access token")

        user_id = payload.get("sub")
        if not user_id:
            raise AuthenticationException("Invalid token payload")

        from uuid import UUID
        user = self.user_repo.get_by_id(UUID(user_id))

        if not user:
            raise NotFoundException("User not found")

        if not user.is_active:
            raise AuthenticationException("User is inactive")

        return user
