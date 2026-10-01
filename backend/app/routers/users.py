from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/users", tags=["users"])


def get_user_or_404(user_id: int, db: Session):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user


@router.post("", response_model=schemas.UserOut, status_code=201)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(status_code=409, detail="Email уже зарегистрирован")
    return crud.create_user(db, data)


@router.get("", response_model=list[schemas.UserOut])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@router.get("/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_or_404(user_id, db)


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = get_user_or_404(user_id, db)
    other = crud.get_user_by_email(db, data.email)
    if other and other.id != user.id:
        raise HTTPException(status_code=409, detail="Email уже зарегистрирован")
    return crud.update_user(db, user, data)


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_or_404(user_id, db)
    crud.delete_user(db, user)
