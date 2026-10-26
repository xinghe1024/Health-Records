


from app.application.services.patient import PatientService
from app.infrastructure.database.repositories.patient import TortoisePatientRepository

def get_patient_service() -> PatientService:
    repository = TortoisePatientRepository()
    service = PatientService(repository)
    return service