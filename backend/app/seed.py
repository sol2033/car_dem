from app import crud, schemas
from app.database import Base, SessionLocal, engine

USERS = [
    ("Иван Петров", "ivan@example.com"),
    ("Мария Смирнова", "maria@example.com"),
    ("Алексей Кузнецов", "alexey@example.com"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    for name, email in USERS:
        if crud.get_user_by_email(db, email) is None:
            crud.create_user(
                db, schemas.UserCreate(name=name, email=email, password="123456")
            )
    db.close()


if __name__ == "__main__":
    seed()
