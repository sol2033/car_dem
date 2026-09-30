from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

DamageType = Literal["Скол", "Вмятина", "Царапина", "Трещина"]
DamageSeverity = Literal["Лёгкая", "Средняя", "Сильная"]


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class DamageCreate(BaseModel):
    type: DamageType
    severity: DamageSeverity
    comment: str = Field(default="", max_length=300)


class DamageOut(BaseModel):
    id: int
    type: str
    severity: str
    comment: str
    x: float | None
    y: float | None
    width: float | None
    height: float | None
    photo_id: int | None

    model_config = ConfigDict(from_attributes=True)


class PhotoOut(BaseModel):
    id: int
    url: str

    model_config = ConfigDict(from_attributes=True)


class AssessmentUpdate(BaseModel):
    brand: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    year: int = Field(ge=1950, le=2026)


class AssessmentOut(BaseModel):
    id: int
    brand: str
    model: str
    year: int
    created_at: datetime
    user_id: int
    photos: list[PhotoOut]
    damages: list[DamageOut]

    model_config = ConfigDict(from_attributes=True)
