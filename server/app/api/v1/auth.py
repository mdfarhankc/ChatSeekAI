from fastapi import APIRouter, status
from app.core.database import SessionDep
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.auth import Token, RefreshTokenRequest
from app.services.auth_service import AuthService
from app.utils.exceptions import AuthenticationException

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    session: SessionDep
):
    """Register a new user."""
    auth_service = AuthService(session)
    user = auth_service.register_user(user_data)
    return user


@router.post("/login", response_model=Token)
def login(
    credentials: UserLogin,
    session: SessionDep
):
    """Login and get access tokens."""
    auth_service = AuthService(session)

    user = auth_service.authenticate_user(
        credentials.username,
        credentials.password
    )

    if not user:
        raise AuthenticationException("Incorrect username or password")

    return auth_service.create_tokens(user)


@router.post("/refresh", response_model=Token)
def refresh_token(
    request: RefreshTokenRequest,
    session: SessionDep
):
    """Refresh access token using refresh token."""
    auth_service = AuthService(session)
    return auth_service.refresh_access_token(request.refresh_token)
