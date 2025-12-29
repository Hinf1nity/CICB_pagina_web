from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.contrib.postgres.fields import ArrayField
from IMGs.models import Img


class User(models.Model):

    estados = [
        ("activo", "Activo"),
        ("inactivo", "Inactivo"),
    ]

    nombre = models.CharField(max_length=255)
    contrasena = models.CharField(max_length=255)
    rni = models.CharField(max_length=50)
    rnic = models.CharField(max_length=50)
    fecha_inscripcion = models.DateField()
    departamento = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    celular = models.CharField(max_length=20)
    imagen = models.ForeignKey(
        Img, on_delete=models.CASCADE, null=True, blank=True)
    registro_empleado = models.CharField(max_length=255)
    estado = models.CharField(
        max_length=16,
        choices=estados,
        default="activo",
    )
    certificaciones = ArrayField(models.CharField(
        max_length=255), blank=True, null=True, default=list)
    mail = models.CharField(max_length=32)

    def save(self, *args, **kwargs):
        if not self.contrasena.startswith('pbkdf2_'):
            self.contrasena = make_password(self.contrasena)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


class UsuarioAdmin(AbstractUser):
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    rol = models.CharField(max_length=50, choices=[
        ('admin_ciudad', 'Admin Ciudad'),
        ('admin_general', 'Admin General'),
    ], default='admin_ciudad')

    def __str__(self):
        return self.username
