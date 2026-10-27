import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, Text,func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PostType(str, enum.Enum):
    video = "video"
    article = "article"

class PostStatus(str, enum.Enum):
    draft = "draft"
    published = "publish"


class Post(Base):
    __tablename__= "posts"
    __table_args__ = (Index("ix_posts_status_published_at", "status", "published_at"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index= True
    )
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), default=None
        )
    type: Mapped[PostType] = mapped_column(Enum(PostType, name="post_type"))
    status: Mapped[PostStatus] = mapped_column(
        Enum(PostStatus, name="post_status"), default=PostStatus.draft
    )
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text,default="")
    cover_image_url: Mapped[str | None] = mapped_column(String(500), default=None)
    video_url: Mapped[str | None] = mapped_column(String(500), default=None)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), default=None)
    duration_seconds: Mapped[int | None] = mapped_column(default=None)
    reading_minutes: Mapped [int | None] = mapped_column(default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),onupdate=func.now()
    )
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None
    )

    author: Mapped["User"] = relationship()