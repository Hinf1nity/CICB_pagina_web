from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    nombre = models.CharField(max_length=255)
    contrasena = models.CharField(max_length=255)
    RNI = models.CharField(max_length=50)
    RNIC = models.CharField(max_length=50)
    fecha_inscripcion = models.DateField()
    departamento = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    celular = models.CharField(max_length=20)
    ruta_foto = models.CharField(max_length=500)
    registro_empleado = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.contrasena.startswith('pbkdf2_'):
            self.contrasena = make_password(self.contrasena)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
