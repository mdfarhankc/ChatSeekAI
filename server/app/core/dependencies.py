from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated

from app.core.database import SessionDep
from app.models.user import User
from app.services.auth_service import AuthService
from app.utils.exceptions import AuthenticationException

security = HTTPBearer()


def get_current_user(
    session: SessionDep,
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> User:
    """
    Dependency to get current authenticated user.
    Extracts token from Authorization header and validates it.
    """
    token = credentials.credentials
    auth_service = AuthService(session)

    try:
        user = auth_service.get_current_user(token)
        return user
    except Exception as e:
        raise AuthenticationException(str(e))


CurrentUserDep = Annotated[User, Depends(get_current_user)]
