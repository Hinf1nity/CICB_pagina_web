from django.core.management.base import BaseCommand
from users.models import UsuarioAdmin as Usuario


class Command(BaseCommand):
    help = "Crea los 9 administradores por ciudad"

    def handle(self, *args, **kwargs):
        ciudades = [
            "La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí",
            "Tarija", "Chuquisaca", "Beni", "Pando"
        ]

        if not Usuario.objects.filter(username="admin").exists():
            Usuario.objects.create_superuser(
                username="admin",
                password="admin",
                rol="admin_general",
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS(
                "Administrador general creado: admin"))
        else:
            self.stdout.write(self.style.WARNING(
                "El administrador general 'admin' ya existe"))

        for nombre in ciudades:
            username = f"admin_{nombre.replace(' ', '').lower()}"

            if not Usuario.objects.filter(username=username).exists():
                admin = Usuario.objects.create_user(
                    username=username,
                    password="admin12345",
                    ciudad=nombre,
                    rol="admin_ciudad",
                    is_staff=True,
                    is_superuser=False
                )
                self.stdout.write(self.style.SUCCESS(
                    f"Administrador creado: {username}"))
            else:
                self.stdout.write(self.style.WARNING(f"{username} ya existe"))
