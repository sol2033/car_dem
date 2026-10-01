from fastapi import FastAPI

from app.database import Base, engine
from app import models
from app.routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car_dem API")

app.include_router(users.router)
