from app import crud
from app.database import Base, SessionLocal, engine
from app.schemas.input import UserCreate

USERS = [
    ("Иван Петров", "ivan@example.com", True),
    ("Мария Смирнова", "maria@example.com", False),
    ("Алексей Кузнецов", "alexey@example.com", False),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    for name, email, is_admin in USERS:
        if crud.get_user_by_email(db, email) is None:
            user = crud.create_user(
                db, UserCreate(name=name, email=email, password="123456")
            )
            user.is_admin = is_admin
            db.commit()
    db.close()


if __name__ == "__main__":
    seed()
