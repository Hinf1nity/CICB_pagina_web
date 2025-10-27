from django.db import models
from IMGs.models import Img
from PDFs.models import PDF

class News(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen = models.ForeignKey(Img, on_delete=models.CASCADE)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo
