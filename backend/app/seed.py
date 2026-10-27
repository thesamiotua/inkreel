from sqlalchemy import select

from app import models # noqa: F401
from app.database import SessionLocal
from app.models.category import Category


CATEGORIES = [
    ("Travel", "travel"),
    ("Food", "food"),
    ("Tech", "tech"),
    ("Lifestyle", "lifestyle"),
    ("Study", "study"),
]

def seed() -> None:
    db = SessionLocal()
    try:
        for name,slug in CATEGORIES:
            existing = db.scalar(select(Category).where(Category.slug == slug))
            if existing is None:
                db.add(Category(name=name, slug=slug))

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
    