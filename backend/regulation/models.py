from django.db import models
from PDFs.models import PDF

class Regulation(models.Model):
    nombre = models.CharField(max_length=255)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
