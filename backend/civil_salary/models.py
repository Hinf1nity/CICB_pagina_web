from django.db import models


class IncidenciasLaborales(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=5)


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)  # Ej: Estructuras, Geotecnia

    def __str__(self):
        return self.nombre


class Nivel(models.Model):
    categoria = models.ForeignKey(
        Categoria, related_name='niveles', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)  # Ej: Senior, Junior

    def __str__(self):
        return f"{self.categoria.nombre} - {self.nombre}"


class Elemento(models.Model):
    nivel = models.ForeignKey(
        Nivel, related_name='elementos', on_delete=models.CASCADE)
    detalle = models.CharField(max_length=255)  # Ej: Cálculo de zapatas
    unidad = models.CharField(max_length=20)   # Ej: m2, Global, Hora
    # El valor sin multiplicar
    valor = models.DecimalField(max_digits=12, decimal_places=3)

    def __str__(self):
        return f"{self.detalle} ({self.unidad})"
