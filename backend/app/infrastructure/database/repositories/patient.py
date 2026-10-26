


from app.infrastructure.database.models.patient import PatientModel
from app.domain.patient import Patient
from app.domain.repositories.patient import PatientRepository


class TortoisePatientRepository(PatientRepository):
    async def get_by_id(self, patient_id: int) -> Patient | None:
        patient_model = await PatientModel.get_or_none(id=patient_id)
        if patient_model is None:
            return None
        return Patient(id=patient_model.id, name=patient_model.name)


    async def delete(self, patient_id: int) -> bool:
        patient_model = await PatientModel.get_or_none(id=patient_id)
        if patient_model is None:
            return False
        await patient_model.delete()
        return True


    async def create(self, patient: Patient) -> Patient:
        patient_model = await PatientModel.create(name=patient.name)
        return Patient(id=patient_model.id, name=patient_model.name)


    async def update(self, patient : Patient) -> Patient | None:
        patient_model = await PatientModel.get_or_none(id=patient.id)
        if patient_model is None:
            return None
        patient_model.name = patient.name
        await patient_model.save(update_fields=["name"])
        return Patient(id=patient_model.id, name=patient_model.name)


    async def list_patients(self, limit: int, offset: int) -> list[Patient]:
        patient_models = await (
            PatientModel.all()
            .order_by("id")
            .offset(offset)
            .limit(limit)
        )

        patient_list = [
            Patient(id=item.id, name=item.name)
            for item in patient_models
        ]
        return patient_list