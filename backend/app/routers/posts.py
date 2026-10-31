import math
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query,status
from sqlalchemy import func, select
from sqlalchemy.orm import Session


from app.auth import get_current_user
from app.database import get_db
from app.models.category import Category
from app.models.post import Post, PostStatus, PostType
from app.models.user import User
from app.schemas.post import PostCreate, PostPage, PostRead, PostUpdate


router = APIRouter(prefix="/posts", tags=["posts"])

def calc_reading_minutes(body: str) -> int:
    words = len(body.split())
    return max(1, math.ceil(words / 200))

def check_category(db: Session, category_id: int | None) -> None:
    if category_id is not None and db.get(Category, category_id) is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Category does not exist",
        )

def get_own_post(post_id: int, user: User, db: Session) -> Post:
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="you can only change your own posts",
        )
    return post


@router.post("", status_code=status.HTTP_201_CREATED, response_model=PostRead)
def create_post(
    payload: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_category(db, payload.category_id)
    post = Post(author_id=current_user.id,**payload.model_dump())
    if post.type == PostType.article:
        post.reading_minutes = calc_reading_minutes(post.body)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("", response_model=PostPage)
def list_post(
    post_type: PostType | None = Query(default=None, alias="type"),
    category: str | None = Query(default=None, max_length=50),
    q: str | None = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    db: Session = Depends(get_db)

):
    filters = [Post.status == PostStatus.published]

    if post_type is not None:
        filters.append(Post.type == post_type)
    if category is not None:
        found = db.scalar(select (category).where(Category.slug == category.lower()))
        if found is None:
            return {"items":[], "total":0, "page": page, "page_size": page_size}
        filters.append(Post.category_id == found.id)
    if q:
        filters.append(Post.title.ilike(f"%{q}%"))
    total = db.scalar(select(func.count(Post.id)).where(*filters))
    posts = db.scalars(
        select(Post)
        .where(*filters)
        .order_by(Post.published_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all

    return {"items": posts, "total": total, "page":page, "page_size": page_size}    



@router.get("/mine", response_model=list[PostRead])
def list_my_posts(
    status_filter: PostStatus | None = Query(default=None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        select(Post)
        .where(Post.author_id == current_user.id)
        .order_by(Post.created_at.desc())
    )
    if status_filter is not None:
        query = query.where(Post.status == status_filter)
    return db.scalars(query).all()


@router.patch("/{post_id}", response_model=PostRead)
def update_post(
    post_id: int,
    payload: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = get_own_post(post_id, current_user, db)
    changes = payload.model_dump(exclude_unset=True)

    for required in ("title", "body"):
        if required in changes and changes[required] is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{required} cannot be empty"
            )
        if "category_id" in changes:
            check_category(db,changes["category_id"])

        for field, value in changes.items():
            setattr(post,field, value)
        if post.type == PostType.article and "body" in changes:
            post.reading_minutes = calc_reading_minutes(post.body)

        db.commit()
        db.refresh(post)
        return post


@router.post("/{post_id}/publish", response_model=PostRead)
def publish_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = get_own_post(post_id, current_user, db)
    if post.type == PostType.video and not post.video_url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Upload a video before publishing",
        )
    if post.status != PostStatus.published:
        post.status = PostStatus.published
        post.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = get_own_post(post_id, current_user, db)
    db.delete(post)
    db.commit()