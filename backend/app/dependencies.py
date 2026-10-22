import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.security import decode_access_token

bearer = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    try:
        user_id = decode_access_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Некорректный access token")

    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user


def get_admin_user(user: models.User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ только для администратора")
    return user


def get_own_assessment(
    assessment_id: int, db: Session, user: models.User, allow_admin: bool = False
):
    assessment = crud.get_assessment(db, assessment_id)
    if assessment is None:
        raise HTTPException(status_code=404, detail="Оценка не найдена")
    # администратору разрешён только просмотр (allow_admin=True)
    if assessment.user_id != user.id and not (allow_admin and user.is_admin):
        raise HTTPException(status_code=403, detail="Нет доступа к этой оценке")
    return assessment
