from django.db import models


class IncidenciasLaborales(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=5)


class CategoriaRendimiento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


class ItemRendimiento(models.Model):
    categoria = models.ForeignKey(
        CategoriaRendimiento,
        related_name='items',
        on_delete=models.CASCADE
    )
    descripcion = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=12, decimal_places=4)

    def __str__(self):
        return f"{self.categoria.nombre} - {self.descripcion}"
