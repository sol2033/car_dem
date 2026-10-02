import os

from sqlalchemy.orm import Session

from app import detector, models, schemas
from app.config import settings


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


def delete_files(filenames: list[str]):
    for filename in filenames:
        path = os.path.join(settings.upload_dir, filename)
        if os.path.exists(path):
            os.remove(path)


def delete_user(db: Session, user: models.User):
    filenames = [
        photo.filename
        for assessment in user.assessments
        for photo in assessment.photos
    ]
    db.delete(user)
    db.commit()
    delete_files(filenames)


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
    for photo in assessment.photos:
        path = os.path.join(settings.upload_dir, photo.filename)
        for found in detector.find_damages(path):
            assessment.damages.append(models.Damage(photo=photo, **found))
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
    filenames = [photo.filename for photo in assessment.photos]
    db.delete(assessment)
    db.commit()
    delete_files(filenames)


def get_damages(db: Session, assessment_id: int):
    return (
        db.query(models.Damage)
        .filter(models.Damage.assessment_id == assessment_id)
        .order_by(models.Damage.id)
        .all()
    )


def get_damage(db: Session, damage_id: int):
    return db.get(models.Damage, damage_id)


def create_damage(db: Session, assessment_id: int, data: schemas.DamageCreate):
    damage = models.Damage(
        type=data.type,
        severity=data.severity,
        comment=data.comment,
        assessment_id=assessment_id,
    )
    db.add(damage)
    db.commit()
    db.refresh(damage)
    return damage


def update_damage(db: Session, damage: models.Damage, data: schemas.DamageCreate):
    damage.type = data.type
    damage.severity = data.severity
    damage.comment = data.comment
    db.commit()
    db.refresh(damage)
    return damage


def delete_damage(db: Session, damage: models.Damage):
    db.delete(damage)
    db.commit()
