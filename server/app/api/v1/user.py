from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.dependencies import CurrentUserDep

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: CurrentUserDep
):
    """Get current user information."""
    return current_user
