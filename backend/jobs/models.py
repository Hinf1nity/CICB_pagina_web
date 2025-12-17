from django.db import models
from django.db import models

from PDFs.models import PDF

class Job(models.Model):

    estados = [
        ("borrador", "Borrador"),
        ("publicado", "Publicado"),
    ]

    titulo = models.CharField(max_length=255)
    nombre_empresa = models.CharField(max_length=255)
    ubicacion = models.CharField(max_length=255)
    salario = models.CharField(max_length=86)
    requisitos = models.JSONField(blank=True, null=True, default=list)
    responsabilidades = models.JSONField(blank=True, null=True, default=list)
    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="borrador",
    )
    descripcion = models.TextField()
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE, null=True, blank=True)
    disponibilidad = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
