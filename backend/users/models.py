from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db.models.signals import pre_save
from django.dispatch import receiver
from IMGs.models import Img


class UsuarioComunManager(BaseUserManager):
    def create_user(self, rnic, nombre, rni, **extra_fields):
        if not rnic:
            raise ValueError("El rnic es obligatorio")
        if not rni:
            raise ValueError("El rni es obligatorio")
        user = self.model(rnic=rnic, nombre=nombre, **extra_fields)
        user.set_password(rni)
        user.save(using=self._db)
        return user

    def create_superuser(self, rnic, nombre, rni, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(rnic, nombre, rni, **extra_fields)


class UsuarioComun(AbstractBaseUser, PermissionsMixin):
    ESTADOS = [("activo", "Activo"), ("inactivo", "Inactivo")]

    rnic = models.CharField(max_length=50, unique=True,
                            blank=True, null=True, editable=False)
    rni = models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    fecha_inscripcion = models.DateField(null=True, blank=True)
    departamento = models.CharField(max_length=100, blank=True)
    especialidad = models.CharField(max_length=100, blank=True)
    celular = models.CharField(max_length=20, blank=True)
    imagen = models.ForeignKey(
        Img, on_delete=models.CASCADE, null=True, blank=True)
    registro_empleado = models.CharField(max_length=255, blank=True)
    estado = models.CharField(max_length=16, choices=ESTADOS, default="activo")
    certificaciones = ArrayField(models.CharField(
        max_length=255), blank=True, default=list)
    mail = models.CharField(max_length=32, blank=True)
    rol = models.CharField(max_length=20, default="Usuario", editable=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioComunManager()

    USERNAME_FIELD = "rnic"
    REQUIRED_FIELDS = ["nombre", "rni"]

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuariocomun_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuariocomun_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.rnic} - {self.nombre}"


def generate_unique_rnic():
    # Este ejemplo genera un número secuencial basado en el total de objetos existentes
    # Asegúrate de que esto cubra tu caso y no cause colisiones en tu base de datos
    max_rnic = UsuarioComun.objects.aggregate(models.Max('rnic'))['rnic__max']
    if max_rnic:
        next_rnic = int(max_rnic) + 1
    else:
        next_rnic = 1  # Empezar desde un valor base
    return str(next_rnic)

# Usando la señal pre_save para generar 'rnic' automáticamente


@receiver(pre_save, sender=UsuarioComun)
def set_rnic(sender, instance, **kwargs):
    if not instance.rnic:
        instance.rnic = generate_unique_rnic()


class UsuarioAdminManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("El username es obligatorio")
        user = self.model(username=username, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


class UsuarioAdmin(AbstractUser):
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    rol = models.CharField(
        max_length=50,
        choices=[("admin_ciudad", "Admin Ciudad"),
                 ("admin_general", "Admin General")],
        default="admin_ciudad",
    )

    objects = UsuarioAdminManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuarioadmin_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarioadmin_permissions',
        blank=True
    )

    def __str__(self):
        return self.username
