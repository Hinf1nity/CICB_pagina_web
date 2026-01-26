import csv
from django.core.management.base import BaseCommand
from users.models import UsuarioComun


class Command(BaseCommand):
    help = "Importa usuarios comunes desde un CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            required=True,
            help="Ruta del archivo CSV"
        )

    def handle(self, *args, **options):
        ruta = options["file"]

        with open(ruta, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                nombre = row["nombre"].strip()
                rni = row["rni"].strip()

                departamento = row.get("departamento", "").strip()
                especialidad = row.get("especialidad", "").strip()
                celular = row.get("celular", "").strip()
                mail = row.get("mail", "").strip()
                registro_empleado = row.get("registro_empleado", "").strip()
                estado = row.get("estado", "activo").strip()

                cert_raw = row.get("certificaciones", "").strip()
                certificaciones = (
                    [c.strip() for c in cert_raw.split(";")] if cert_raw else []
                )

                if UsuarioComun.objects.filter(rni=rni).exists():
                    self.stdout.write(
                        self.style.WARNING(f"Usuario con RNI {rni} ya existe, omitido")
                    )
                    continue

                usuario = UsuarioComun.objects.create_user(
                    rnic=None,
                    nombre=nombre,
                    rni=rni,
                    departamento=departamento,
                    especialidad=especialidad,
                    celular=celular,
                    mail=mail,
                    registro_empleado=registro_empleado,
                    estado=estado,
                    certificaciones=certificaciones,
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Usuario creado: {usuario.nombre} (RNIC {usuario.rnic})"
                    )
                )
