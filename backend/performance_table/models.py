from django.db import models
from django.contrib.postgres.fields import ArrayField


class PerformanceTable(models.Model):

    codigo = models.CharField(max_length=255)
    actividad = models.CharField(max_length=255)
    unidad = models.CharField(max_length=32)
    recursos = ArrayField(models.CharField(
        max_length=255), blank=True, null=True, default=list)
    cantidad = ArrayField(models.CharField(
        max_length=255), blank=True, null=True, default=list)

    def __str__(self):
        return self.codigo
