import csv
from django.db import transaction, connection
from django.core.management.base import BaseCommand
from users.models import UsuarioComun

class Command(BaseCommand):
    help = "Importa usuarios comunes desde un CSV de forma eficiente"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, required=True)

    def handle(self, *args, **options):
        ruta = options["file"]
        
        self.stdout.write("Indexando registros existentes...")
        existentes = set(UsuarioComun.objects.values_list('rni', flat=True))
        
        nuevos_usuarios = []
        
        with open(ruta, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                rni = row["rni"].strip()
                
                if rni in existentes:
                    continue

                usuario = UsuarioComun(
                    nombre=row["nombre"].strip(),
                    rni=rni,
                    departamento=row.get("departamento", "").strip(),
                    especialidad=row.get("especialidad", "").strip(),
                    celular=row.get("celular", "").strip(),
                    mail=row.get("mail", "").strip(),
                    registro_empleado=row.get("registro_empleado", "").strip(),
                    estado=row.get("estado", "activo").strip(),
                    certificaciones=(
                        [c.strip() for c in row["certificaciones"].split(";")] 
                        if row.get("certificaciones") else []
                    )
                )
                
                nuevos_usuarios.append(usuario)
                existentes.add(rni)

        if nuevos_usuarios:
            self.stdout.write(f"Insertando {len(nuevos_usuarios)} usuarios...")
            with transaction.atomic():
                UsuarioComun.objects.bulk_create(nuevos_usuarios, batch_size=1000)
            self.stdout.write(self.style.SUCCESS(f"Éxito: Se crearon {len(nuevos_usuarios)} registros."))
        else:
            self.stdout.write("No hay nuevos registros para importar.")