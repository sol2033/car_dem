import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import crud, schemas
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/assessments", tags=["assessments"])


def get_assessment_or_404(assessment_id: int, db: Session):
    assessment = crud.get_assessment(db, assessment_id)
    if assessment is None:
        raise HTTPException(status_code=404, detail="Оценка не найдена")
    return assessment


def save_photo(photo: UploadFile):
    extension = os.path.splitext(photo.filename)[1]
    filename = uuid.uuid4().hex + extension
    with open(os.path.join(settings.upload_dir, filename), "wb") as file:
        file.write(photo.file.read())
    return filename


def delete_files(filenames: list[str]):
    for filename in filenames:
        path = os.path.join(settings.upload_dir, filename)
        if os.path.exists(path):
            os.remove(path)


@router.post("", response_model=schemas.AssessmentOut, status_code=201)
def create_assessment(
    brand: str = Form(min_length=1, max_length=50),
    model: str = Form(min_length=1, max_length=50),
    year: int = Form(ge=1950, le=2026),
    user_id: int = Form(),
    photos: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
):
    if crud.get_user(db, user_id) is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    photos = [photo for photo in photos if photo.filename]
    for photo in photos:
        if not photo.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Можно загружать только изображения")

    filenames = [save_photo(photo) for photo in photos]
    return crud.create_assessment(db, brand, model, year, user_id, filenames)


@router.get("", response_model=list[schemas.AssessmentOut])
def read_assessments(user_id: int | None = None, db: Session = Depends(get_db)):
    return crud.get_assessments(db, user_id)


@router.get("/{assessment_id}", response_model=schemas.AssessmentOut)
def read_assessment(assessment_id: int, db: Session = Depends(get_db)):
    return get_assessment_or_404(assessment_id, db)


@router.put("/{assessment_id}", response_model=schemas.AssessmentOut)
def update_assessment(
    assessment_id: int, data: schemas.AssessmentUpdate, db: Session = Depends(get_db)
):
    assessment = get_assessment_or_404(assessment_id, db)
    return crud.update_assessment(db, assessment, data)


@router.delete("/{assessment_id}", status_code=204)
def delete_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = get_assessment_or_404(assessment_id, db)
    filenames = [photo.filename for photo in assessment.photos]
    crud.delete_assessment(db, assessment)
    delete_files(filenames)
