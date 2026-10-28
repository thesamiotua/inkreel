from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserPublic, UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    changes = payload.model_dump(exclude_unset=True)

    for required in ("username","display_name"):
        if required in changes and changes[required] is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{required} cannot be empty",
            )
    if "username" in changes:
        new_username = changes["username"].lower()
        taken = db.scalar(
            select(User).where(
                User.username == new_username,User.id != current_user.id
            )
        )
        if taken:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken"
            )
        changes["username"] = new_username
    for field, value in changes.items():
        setattr(current_user,field, value)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{username}", response_model=UserPublic)
def get_profile(username: str, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.username == username.lower()))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

