import csv
from django.core.management.base import BaseCommand
from civil_salary.models import Categoria, Nivel, Elemento


class Command(BaseCommand):
    help = "Importa aranceles desde un CSV"

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
                trabajo = row["trabajo"].strip()
                detalle = row["detalle"].strip()
                nivel = row['nivel'].strip()
                valor = row["valor"].strip()
                unidad = row["unidad"].strip()
                print(
                    f"{trabajo} - {detalle} - {nivel} - {valor} - {unidad}")

                categoria, created = Categoria.objects.get_or_create(
                    nombre=trabajo
                )

                nivel_obj, created = Nivel.objects.get_or_create(
                    categoria=categoria,
                    nombre=nivel
                )

                item, created = Elemento.objects.get_or_create(
                    nivel=nivel_obj,
                    detalle=detalle,
                    valor=valor,
                    unidad=unidad
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Item creado: {item.detalle} en {categoria.nombre}"
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Item ya existe: {item.detalle} en {categoria.nombre}"
                        )
                    )
