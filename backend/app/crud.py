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


def get_assessments(db: Session, user_id: int | None = None):
    query = db.query(models.Assessment)
    if user_id is not None:
        query = query.filter(models.Assessment.user_id == user_id)
    return query.order_by(models.Assessment.created_at.desc()).all()


def get_assessment(db: Session, assessment_id: int):
    return db.get(models.Assessment, assessment_id)


def create_assessment(
    db: Session, brand: str, model: str, year: int, user_id: int, filenames: list[str]
):
    assessment = models.Assessment(
        brand=brand, model=model, year=year, user_id=user_id
    )
    for filename in filenames:
        assessment.photos.append(models.Photo(filename=filename))
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def update_assessment(
    db: Session, assessment: models.Assessment, data: schemas.AssessmentUpdate
):
    assessment.brand = data.brand
    assessment.model = data.model
    assessment.year = data.year
    db.commit()
    db.refresh(assessment)
    return assessment


def delete_assessment(db: Session, assessment: models.Assessment):
    db.delete(assessment)
    db.commit()
