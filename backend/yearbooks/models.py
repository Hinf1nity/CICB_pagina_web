from django.db import models
from IMGs.models import Img
from PDFs.models import PDF

class Yearbook(models.Model):
    nombre = models.CharField(max_length=255)
    img = models.ForeignKey(Img, on_delete=models.CASCADE)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
