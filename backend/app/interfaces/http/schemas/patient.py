from pydantic import BaseModel, ConfigDict, Field


class PatientResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    model_config = ConfigDict(str_strip_whitespace=True)


class PatientUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    model_config = ConfigDict(str_strip_whitespace=True)