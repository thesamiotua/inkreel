from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.post import PostStatus, PostType
from app.schemas.user import UserPublic


class PostCreate(BaseModel):
    type: PostType
    title: str = Field(min_length=1, max_length=200)
    body: str = ""
    category_id: int | None = None
    cover_img_url: str | None = None
    video_url: str | None = None
    thumbnail_url: str | None = None
    duration_seconds: int | None = Field(default=None, ge=0)


class PostUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    body: str | None = None
    category_id: int | None = None
    cover_img_url: str | None = None
    video_url: str | None = None
    thumbnail_url: str | None = None
    duration_seconds: int | None = Field(default=None, ge=0)

class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: PostType
    status: PostStatus
    title: str
    body: str
    category_id: int | None
    cover_image_url: str | None
    video_url: str | None
    thumbnail_url: str | None
    duration_seconds: int | None
    reading_minutes: int | None
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None
    author: UserPublic
