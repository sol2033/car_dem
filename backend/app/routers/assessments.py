import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import crud, models
from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user, get_own_assessment
from app.schemas.input import AssessmentUpdate
from app.schemas.output import AssessmentOut

router = APIRouter(prefix="/assessments", tags=["assessments"])


def save_photo(photo: UploadFile):
    extension = os.path.splitext(photo.filename)[1]
    filename = uuid.uuid4().hex + extension
    with open(os.path.join(settings.upload_dir, filename), "wb") as file:
        file.write(photo.file.read())
    return filename


@router.post("", response_model=AssessmentOut, status_code=201)
def create_assessment(
    brand: str = Form(min_length=1, max_length=50),
    model: str = Form(min_length=1, max_length=50),
    year: int = Form(ge=1950, le=2026),
    photos: list[UploadFile] = File(
        default=[],
        json_schema_extra={"items": {"type": "string", "format": "binary"}},
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    photos = [photo for photo in photos if photo.filename]
    for photo in photos:
        if not photo.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Можно загружать только изображения")

    filenames = [save_photo(photo) for photo in photos]
    return crud.create_assessment(db, brand, model, year, current_user.id, filenames)


@router.get("", response_model=list[AssessmentOut])
def read_assessments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_assessments(db, current_user.id)


@router.get("/{assessment_id}", response_model=AssessmentOut)
def read_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return get_own_assessment(assessment_id, db, current_user)


@router.put("/{assessment_id}", response_model=AssessmentOut)
def update_assessment(
    assessment_id: int,
    data: AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    assessment = get_own_assessment(assessment_id, db, current_user)
    return crud.update_assessment(db, assessment, data)


@router.delete("/{assessment_id}", status_code=204)
def delete_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    assessment = get_own_assessment(assessment_id, db, current_user)
    crud.delete_assessment(db, assessment)
