from fastapi import APIRouter, Depends, HTTPException, Query

from app.application.services.patient import PatientService
from app.interfaces.http.dependencies import get_patient_service
from app.interfaces.http.schemas.patient import PatientCreate, PatientResponse, PatientUpdate


router = APIRouter(
    prefix="/patient",
    tags=["患者"]
)

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    service: PatientService = Depends(get_patient_service),
) -> PatientResponse:
    patient = await service.get_patient(patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return PatientResponse.model_validate(patient)


@router.delete("/{patient_id}", status_code=204)
async def delete_patient(
    patient_id: int,
    service: PatientService = Depends(get_patient_service),
) -> None:
    deleted = await service.delete_patient(patient_id)
    if deleted is False:
        raise HTTPException(status_code=404, detail="Patient not found")
    return


@router.post("", response_model=PatientResponse, status_code=201)
async def create_patient(
    patient_data: PatientCreate,
    service: PatientService = Depends(get_patient_service),
) -> PatientResponse:
    created = await service.create_patient(patient_data.name)
    return PatientResponse.model_validate(created)


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    service: PatientService = Depends(get_patient_service),
) -> PatientResponse:
    updated = await service.update_patient(patient_id, patient_data.name)
    if updated is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return PatientResponse.model_validate(updated)


@router.get("", response_model=list[PatientResponse])
async def list_patients(
    limit : int = Query(default = 20, ge = 1, le = 100),
    offset: int = Query(default = 0, ge = 0),
    service: PatientService = Depends(get_patient_service),
) -> list[PatientResponse]:
    patients = await service.list_patients(limit = limit, offset = offset)
    listed_patients = [
        PatientResponse.model_validate(item)
        for item in patients
    ]
    return listed_patients