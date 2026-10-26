from dataclasses import dataclass



@dataclass
class Patient:
    id:int | None
    name:str