from django.db import models
from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField
from PDFs.models import PDF

class Job(models.Model):

    estados = [
        ("Bor", "Borrador"),
        ("Pub", "Publicado"),
    ]

    titulo = models.CharField(max_length=255)
    nombre_empresa = models.CharField(max_length=255)
    ubicacion = models.PointField()
    salario = models.CharField(max_length=64)
    requisitos = ArrayField(models.CharField(max_length=64), blank=True, default=list)
    responsabilidades = ArrayField(models.CharField(max_length=64), blank=True, default=list)
    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="Bor",
    )
    descripcion = models.TextField()
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE, null=True, blank=True)
    disponibilidad = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
