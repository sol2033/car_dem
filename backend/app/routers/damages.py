from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(tags=["damages"])


def get_damage_or_404(damage_id: int, db: Session):
    damage = crud.get_damage(db, damage_id)
    if damage is None:
        raise HTTPException(status_code=404, detail="Повреждение не найдено")
    return damage


def check_assessment(assessment_id: int, db: Session):
    if crud.get_assessment(db, assessment_id) is None:
        raise HTTPException(status_code=404, detail="Оценка не найдена")


@router.post(
    "/assessments/{assessment_id}/damages",
    response_model=schemas.DamageOut,
    status_code=201,
)
def create_damage(
    assessment_id: int, data: schemas.DamageCreate, db: Session = Depends(get_db)
):
    check_assessment(assessment_id, db)
    return crud.create_damage(db, assessment_id, data)


@router.get(
    "/assessments/{assessment_id}/damages", response_model=list[schemas.DamageOut]
)
def read_damages(assessment_id: int, db: Session = Depends(get_db)):
    check_assessment(assessment_id, db)
    return crud.get_damages(db, assessment_id)


@router.get("/damages/{damage_id}", response_model=schemas.DamageOut)
def read_damage(damage_id: int, db: Session = Depends(get_db)):
    return get_damage_or_404(damage_id, db)


@router.put("/damages/{damage_id}", response_model=schemas.DamageOut)
def update_damage(
    damage_id: int, data: schemas.DamageCreate, db: Session = Depends(get_db)
):
    damage = get_damage_or_404(damage_id, db)
    return crud.update_damage(db, damage, data)


@router.delete("/damages/{damage_id}", status_code=204)
def delete_damage(damage_id: int, db: Session = Depends(get_db)):
    damage = get_damage_or_404(damage_id, db)
    crud.delete_damage(db, damage)
