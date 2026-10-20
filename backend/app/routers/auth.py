from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.input import LoginRequest, RefreshRequest, UserCreate
from app.schemas.output import AccessTokenOut, TokenOut, UserOut
from app.security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=409, detail="Email уже зарегистрирован")
    return crud.create_user(db, data)


@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return TokenOut(
        access_token=create_access_token(user.id),
        refresh_token=crud.create_refresh_token_for_user(db, user),
    )


@router.post("/refresh", response_model=AccessTokenOut)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    refresh_token = crud.get_refresh_token(db, data.refresh_token)
    if refresh_token is None:
        raise HTTPException(status_code=401, detail="Некорректный refresh token")
    if refresh_token.revoked:
        raise HTTPException(status_code=401, detail="Refresh token отозван")
    if refresh_token.expires_at < datetime.now():
        raise HTTPException(status_code=401, detail="Refresh token истёк")
    return AccessTokenOut(access_token=create_access_token(refresh_token.user_id))


@router.post("/logout", status_code=204)
def logout(data: RefreshRequest, db: Session = Depends(get_db)):
    refresh_token = crud.get_refresh_token(db, data.refresh_token)
    if refresh_token is not None:
        crud.revoke_refresh_token(db, refresh_token)


@router.get("/me", response_model=UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
