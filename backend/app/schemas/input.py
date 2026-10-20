from typing import Literal

from pydantic import BaseModel, EmailStr, Field

DamageType = Literal["Скол", "Вмятина", "Царапина", "Трещина"]
DamageSeverity = Literal["Лёгкая", "Средняя", "Сильная"]


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class DamageCreate(BaseModel):
    type: DamageType
    severity: DamageSeverity
    comment: str = Field(default="", max_length=300)


class AssessmentUpdate(BaseModel):
    brand: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    year: int = Field(ge=1950, le=2026)
