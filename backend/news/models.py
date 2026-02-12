from django.db import models
from IMGs.models import Img
from PDFs.models import PDF


class News(models.Model):

    estados = [
        ("borrador", "Borrador"),
        ("publicado", "Publicado"),
    ]

    titulo = models.CharField(max_length=255)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    categoria = models.CharField(max_length=255, null=True, blank=True)
    resumen = models.TextField()
    descripcion = models.TextField()
    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="borrador",
    )
    imagen = models.ForeignKey(
        Img, on_delete=models.CASCADE, null=True, blank=True)
    pdf = models.ForeignKey(
        PDF, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.titulo
