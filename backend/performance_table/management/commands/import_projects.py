import csv
import hashlib
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from performance_table.models import PerformanceTable, QuantifiedResource, ResourceChart

class Command(BaseCommand):
    help = "Importa proyectos (PerformanceTable y Resources) desde un CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            required=True,
            help="Ruta del archivo CSV"
        )
        parser.add_argument(
            "--encoding",
            type=str,
            default="utf-8-sig",
            help="Encoding del archivo (default: utf-8-sig)"
        )

    def handle(self, *args, **options):
        ruta = options["file"]
        encoding = options["encoding"]

        self.stdout.write(f"Iniciando importación desde: {ruta}")

        try:
            with open(ruta, newline="", encoding=encoding) as csvfile:
                reader = csv.DictReader(csvfile)

                for i, row in enumerate(reader):
                    tarea_nombre = row.get("TAREA", "").strip()
                    tarea_unidad = row.get("UNIDAD", "").strip()
                    
                    recurso_nombre = row.get("RECURSO", "").strip()
                    recurso_cantidad = row.get("CANT", "0").strip()
                    recurso_unidad = row.get("UNID", "").strip()

                    if not tarea_nombre or not recurso_nombre:
                        continue

                    code_hash = hashlib.md5(tarea_nombre.encode()).hexdigest()[:6].upper()
                    generated_code = f"TAR-{code_hash}"

                    performance_table, created_pt = PerformanceTable.objects.get_or_create(
                        actividad=tarea_nombre,
                        defaults={
                            'unidad': tarea_unidad,
                            'codigo': generated_code,
                            'categoria': 'Importado'
                        }
                    )

                    if created_pt:
                        self.stdout.write(self.style.SUCCESS(f"Tarea Creada: {tarea_nombre}"))
                    
                    resource, created_res = ResourceChart.objects.get_or_create(
                        nombre=recurso_nombre,
                        defaults={
                            'unidad': recurso_unidad
                        }
                    )

                    if created_res:
                        self.stdout.write(f"  > Nuevo recurso creado: {recurso_nombre}")

                    qr, created_qr = QuantifiedResource.objects.get_or_create(
                        performance_table=performance_table,
                        recurso=resource,
                        defaults={
                            'cantidad': recurso_cantidad
                        }
                    )

                    if created_qr:
                        self.stdout.write(f"    - Asignado: {recurso_cantidad} {recurso_unidad}")
                    else:
                        if qr.cantidad != recurso_cantidad:
                            qr.cantidad = recurso_cantidad
                            qr.save()
                            self.stdout.write(f"    - Actualizado: {recurso_cantidad}")

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"No se encontró el archivo: {ruta}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error durante la importación: {str(e)}"))