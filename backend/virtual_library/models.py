from django.db import models
from PDFs.models import PDF


class VirtualLibrary(models.Model):

    estodos = [
        ("publicado", "Publicado"),
        ("borrador", "Borrador"),
        ("archivado", "Archivado"),
    ]

    categorias = [
        ("Ingeniería Estructural", "Ingeniería Estructural"),
        ("Ingeniería Hidráulica", "Ingeniería Hidráulica"),
        ("Ingeniería Sanitaria", "Ingeniería Sanitaria"),
        ("Vias y Transporte", "Vias y Transporte"),
        ("Ingeniería Geotécnica", "Ingeniería Geotécnica"),
        ("Gerencias de la Construcción", "Gerencias de la Construcción"),
        ("otros", "Otros"),
    ]

    titulo = models.CharField(max_length=255)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)
    anio = models.CharField(max_length=4)
    categoria = models.CharField(max_length=50, choices=categorias)
    estado = models.CharField(max_length=20, choices=estodos)
    autor = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.titulo
