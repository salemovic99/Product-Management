from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Status
import models

async def seed_statuses(session: AsyncSession):
    result = await session.execute(select(models.Status))
    existing = result.scalars().first()
    if not existing:
        statuses = [
            models.Status(name="in_use"),
            models.Status(name="damaged"),
            models.Status(name="lost"),
            models.Status(name="under_repair"),
        ]
        session.add_all(statuses)
        await session.commit()
