from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AccessTokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


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
