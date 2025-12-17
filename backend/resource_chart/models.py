from django.db import models

class ResourceChart(models.Model):
    nombre = models.CharField(max_length=255)
    unidad = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} ({self.unidad})"
