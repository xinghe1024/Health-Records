

from app.domain.patient import Patient
from app.domain.repositories.patient import PatientRepository


class PatientService:
    def __init__(self,repository: PatientRepository) -> None:
        self.repository = repository


    async def get_patient(self,patient_id: int) -> Patient | None:
        patient = await self.repository.get_by_id(patient_id)
        return patient


    async def delete_patient(self, patient_id: int) -> bool:
        deleted = await self.repository.delete(patient_id)
        return deleted


    async def create_patient(self, name: str) -> Patient:
        patient = Patient(id = None, name = name)
        created = await self.repository.create(patient)
        return created


    async def update_patient(self, patient_id: int, name: str) -> Patient | None:
        patient = Patient(id=patient_id, name=name)
        updated = await self.repository.update(patient)
        return updated


    async def list_patients(self, limit: int, offset: int) -> list[Patient]:
        patients = await self.repository.list_patients(limit=limit, offset=offset)
        return patients