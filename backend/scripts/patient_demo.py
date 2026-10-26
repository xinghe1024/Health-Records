import asyncio


from tortoise import Tortoise

from app.infrastructure.database.config import TORTOISE_ORM
from app.infrastructure.database.models import PatientModel
from app.application.services.patient import PatientService
from app.infrastructure.database.repositories.patient import TortoisePatientRepository

async def main():
    try:
        await Tortoise.init(config=TORTOISE_ORM)
        repository = TortoisePatientRepository()
        service = PatientService(repository)
        patient = await service.get_patient(6)
        print(patient)
        patient1 = await service.get_patient(2)
        print(patient1)
        deleted = await service.delete_patient(2)
        print(deleted)

    finally:
        await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(main())