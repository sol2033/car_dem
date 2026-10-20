from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.input import UserCreate
from app.schemas.output import UserOut

router = APIRouter(prefix="/users", tags=["users"])


def check_own_user(user_id: int, current_user: models.User):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа к этому пользователю")


@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, current_user: models.User = Depends(get_current_user)):
    check_own_user(user_id, current_user)
    return current_user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    check_own_user(user_id, current_user)
    other = crud.get_user_by_email(db, data.email)
    if other and other.id != current_user.id:
        raise HTTPException(status_code=409, detail="Email уже зарегистрирован")
    return crud.update_user(db, current_user, data)


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    check_own_user(user_id, current_user)
    crud.delete_user(db, current_user)
