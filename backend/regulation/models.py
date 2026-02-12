from django.db import models
from PDFs.models import PDF


class Regulation(models.Model):

    estados = [
        ("borrador", "Borrador"),
        ("vigente", "Vigente"),
        ("archivado", "Archivado"),
    ]
    categorias = [
        ("reglamento", "Reglamento"),
        ("estatuto", "Estatuto"),
        ("ley", "Ley"),
        ("decreto", "Decreto"),
        ("resolucion", "Resolución"),
        ("documentacion junta", "Documentación Junta"),
        ("documentacion directorio", "Documentación Directorio"),
        ("otro", "Otro"),
    ]

    nombre = models.CharField(max_length=255)
    pdf = models.ForeignKey(PDF, on_delete=models.CASCADE)
    descripcion = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    categoria = models.CharField(
        max_length=32,
        choices=categorias,
        default="otro",
    )
    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="borrador",
    )

    def __str__(self):
        return self.nombre
