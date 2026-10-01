import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app import models
from app.routers import assessments, users

Base.metadata.create_all(bind=engine)
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(title="Car_dem API")

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(users.router)
app.include_router(assessments.router)
