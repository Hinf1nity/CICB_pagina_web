from django.db import models
from PDFs.models import PDF

class Job(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)
    disponibilidad = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
