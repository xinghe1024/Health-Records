from tortoise import migrations
from tortoise.migrations import operations as ops
from tortoise import fields

class Migration(migrations.Migration):
    initial = True

    operations = [
        ops.CreateModel(
            name='PatientModel',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('name', fields.CharField(max_length=50)),
            ],
            options={'table': 'patientmodel', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
    ]
