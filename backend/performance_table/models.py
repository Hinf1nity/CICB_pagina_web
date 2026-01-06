from django.db import models
from django.contrib.postgres.fields import ArrayField

from resource_chart.models import ResourceChart

class PerformanceTable(models.Model):

    codigo = models.CharField(max_length=255)
    actividad = models.CharField(max_length=255)
    unidad = models.CharField(max_length=32)
    recursos = models.ManyToManyField(ResourceChart, blank=True, related_name='performance_tables')
    cantidad = ArrayField(models.CharField(
        max_length=255), blank=True, null=True, default=list)

    def __str__(self):
        return self.codigo
