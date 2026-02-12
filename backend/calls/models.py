from django.db import models
from PDFs.models import PDF


class Call(models.Model):

    estados = [
        ("borrador", "Borrador"),
        ("activa", "Activa"),
        ("cerrada", "Cerrada"),
    ]

    nombre = models.CharField(max_length=255)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()

    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="borrador",
    )

    def __str__(self):
        return self.nombre
