from sqlalchemy.orm import Session
from database import SessionLocal
from models import Status

def seed_statuses():
    db: Session = SessionLocal()

    statuses = [
        "in_use",
        "damaged",
        "lost",
        "under_repair"   
    ]

    for status in statuses:
        exists = db.query(Status).filter(Status.name == status).first()
        if not exists:
            db.add(Status(name=status))

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_statuses()
    print("Statuses seeded.")
