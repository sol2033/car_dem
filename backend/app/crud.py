from sqlalchemy.orm import Session

from app import models, schemas


def get_users(db: Session):
    return db.query(models.User).order_by(models.User.id).all()


def get_user(db: Session, user_id: int):
    return db.get(models.User, user_id)


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, data: schemas.UserCreate):
    user = models.User(name=data.name, email=data.email, password=data.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: models.User, data: schemas.UserCreate):
    user.name = data.name
    user.email = data.email
    user.password = data.password
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: models.User):
    db.delete(user)
    db.commit()
