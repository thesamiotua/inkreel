from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user
from app.auth import hash_password
from app.database import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserRead)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    username = payload.username.lower()

    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    if db.scalar(select(User).where(User.username == username)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username alreadt taken"

        )
    user = User(
        email=email,
        username=username,
        display_name=payload.display_name,
        password_hash=hash_password(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    identifier = form_data.username.lower()
    user = db.scalar(
        select(User).where(or_(User.email == identifier, User.username == identifier))
    )
    if (
        user is None
        or not user.is_active
        or not verify_password(form_data.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW_Authenticate": "Bearer"}
        )
    return Token(access_token=create_access_token(user.id))

@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user