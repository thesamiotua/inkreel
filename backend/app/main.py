from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.routers import auth


from app.database import get_db

app = FastAPI(title="Inkeeper API")

app.include_router(auth.router)

@app.get("/health")
def health():
    return { "status":"okay"}

@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    db.execute(text("select 1"))
    return {"database": "okay"}
