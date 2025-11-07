from django.db import models
from resource_chart.models import ResourceChart

class PerformanceChart(models.Model):
    tarea = models.CharField(max_length=255)
    unidad = models.CharField(max_length=100)
    recurso = models.ForeignKey(ResourceChart, on_delete=models.CASCADE)
    cantidad = models.FloatField()

    def __str__(self):
        return f"{self.tarea} - {self.recurso.nombre} ({self.cantidad} {self.unidad})"
