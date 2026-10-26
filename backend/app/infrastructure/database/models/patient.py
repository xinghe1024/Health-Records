from tortoise import fields
from tortoise.models import Model


class PatientModel(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=50)
