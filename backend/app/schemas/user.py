from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    display_name: str = Field(min_length=3, max_length=80)
    password: str = Field(min_length=8, max_length=128)

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    username: str
    display_name:str
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    display_name: str
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    created_at: datetime

class UserUpdate(BaseModel):
    display_name: str | None = Field(default=None , min_length=1,max_length=80)
    username: str | None = Field(
        default=None, min_length=3, max_length=30,pattern=r"^[a-zA-Z0-9_]+$"
    )
    bio: str | None = Field(default=None, max_length=160)

    