from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.dependencies import get_current_user, get_own_assessment
from app.schemas.input import DamageCreate
from app.schemas.output import DamageOut

router = APIRouter(tags=["damages"])


def get_own_damage(damage_id: int, db: Session, user: models.User):
    damage = crud.get_damage(db, damage_id)
    if damage is None:
        raise HTTPException(status_code=404, detail="Повреждение не найдено")
    get_own_assessment(damage.assessment_id, db, user)
    return damage


@router.post(
    "/assessments/{assessment_id}/damages",
    response_model=DamageOut,
    status_code=201,
)
def create_damage(
    assessment_id: int,
    data: DamageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    get_own_assessment(assessment_id, db, current_user)
    return crud.create_damage(db, assessment_id, data)


@router.get(
    "/assessments/{assessment_id}/damages", response_model=list[DamageOut]
)
def read_damages(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    get_own_assessment(assessment_id, db, current_user, allow_admin=True)
    return crud.get_damages(db, assessment_id)


@router.get("/damages/{damage_id}", response_model=DamageOut)
def read_damage(
    damage_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return get_own_damage(damage_id, db, current_user)


@router.put("/damages/{damage_id}", response_model=DamageOut)
def update_damage(
    damage_id: int,
    data: DamageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    damage = get_own_damage(damage_id, db, current_user)
    return crud.update_damage(db, damage, data)


@router.delete("/damages/{damage_id}", status_code=204)
def delete_damage(
    damage_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    damage = get_own_damage(damage_id, db, current_user)
    crud.delete_damage(db, damage)
