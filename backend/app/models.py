from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)

    assessments = relationship(
        "Assessment", back_populates="user", cascade="all, delete-orphan"
    )


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True)
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="assessments")
    photos = relationship(
        "Photo", back_populates="assessment", cascade="all, delete-orphan"
    )
    damages = relationship(
        "Damage", back_populates="assessment", cascade="all, delete-orphan"
    )


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True)
    path = Column(String(200), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)

    assessment = relationship("Assessment", back_populates="photos")
    damages = relationship("Damage", back_populates="photo")


class Damage(Base):
    __tablename__ = "damages"

    id = Column(Integer, primary_key=True)
    type = Column(String(30), nullable=False)
    severity = Column(String(30), nullable=False)
    comment = Column(String(300), nullable=False, default="")
    x = Column(Float)
    y = Column(Float)
    width = Column(Float)
    height = Column(Float)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    photo_id = Column(Integer, ForeignKey("photos.id"))

    assessment = relationship("Assessment", back_populates="damages")
    photo = relationship("Photo", back_populates="damages")
