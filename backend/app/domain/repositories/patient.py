from abc import ABC, abstractmethod


from app.domain.patient import Patient


class PatientRepository(ABC):
    @abstractmethod
    async def get_by_id(self, patient_id:int) -> Patient | None:
        pass


    @abstractmethod
    async def delete(self, patient_id:int) -> bool:
        pass


    @abstractmethod
    async def create(self, patient:Patient) ->  Patient:
        pass


    @abstractmethod
    async def update(self, patient:Patient) -> Patient | None:
        pass


    @abstractmethod
    async def list_patients(self, limit: int, offset: int) -> list[Patient]:
        pass