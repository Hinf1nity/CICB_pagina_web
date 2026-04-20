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

    @property
    def tiene_materiales(self):
        # Usamos any() sobre los recursos ya prefetcheados en memoria
        return any(item.recurso.categoria == 'Materiales' for item in self.quantifiedresource_set.all())

    @property
    def tiene_obra(self):
        return any(item.recurso.categoria == 'Mano de Obra' for item in self.quantifiedresource_set.all())

    @property
    def tiene_herramientas(self):
        return any(item.recurso.categoria == 'Herramientas y Equipo' for item in self.quantifiedresource_set.all())


class QuantifiedResource(models.Model):
    performance_table = models.ForeignKey(
        PerformanceTable, on_delete=models.CASCADE)
    recurso = models.ForeignKey(ResourceChart, on_delete=models.CASCADE)

    cantidad = models.CharField(max_length=255)

    class Meta:
        unique_together = ('performance_table', 'recurso')
