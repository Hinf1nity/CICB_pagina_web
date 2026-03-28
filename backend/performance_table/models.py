from django.db import models


class ResourceChart(models.Model):

    class Category(models.TextChoices):
        MATERIALES = 'Materiales', 'Materiales'
        MANO_DE_OBRA = 'Mano de Obra', 'Mano de Obra'
        HERRAMIENTAS = 'Herramientas y Equipo', 'Herramientas y Equipo'

    nombre = models.CharField(max_length=255)
    unidad = models.CharField(max_length=100)
    categoria = models.CharField(
        max_length=50, choices=Category.choices, default=Category.MATERIALES)

    def __str__(self):
        return f"{self.nombre} ({self.unidad})"


class PerformanceTable(models.Model):
    codigo = models.CharField(max_length=255)
    actividad = models.CharField(max_length=255)
    unidad = models.CharField(max_length=32)
    categoria = models.CharField(max_length=255)

    recursos = models.ManyToManyField(
        ResourceChart,
        through='QuantifiedResource',
        related_name='performance_tables'
    )

    def __str__(self):
        return self.codigo


class QuantifiedResource(models.Model):
    performance_table = models.ForeignKey(
        PerformanceTable, on_delete=models.CASCADE)
    recurso = models.ForeignKey(ResourceChart, on_delete=models.CASCADE)

    cantidad = models.CharField(max_length=255)

    class Meta:
        unique_together = ('performance_table', 'recurso')
