import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from civil_salary.models import Categoria, Nivel, Elemento


class Command(BaseCommand):
    help = "Importa aranceles desde un CSV de forma eficiente"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, required=True)

    def handle(self, *args, **options):
        ruta = options["file"]

        # Diccionarios para evitar consultas repetidas
        categorias_cache = {}
        niveles_cache = {}
        creados = 0

        try:
            with open(ruta, newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)

                # Todo se ejecuta en una sola transacción
                with transaction.atomic():
                    for row in reader:
                        trabajo = row["trabajo"].strip()
                        nivel_nombre = row['nivel'].strip()
                        detalle = row["detalle"].strip()
                        valor = row["valor"].strip()
                        unidad = row["unidad"].strip()

                        # 1. Obtener o crear Categoría (Caché local)
                        if trabajo not in categorias_cache:
                            obj, _ = Categoria.objects.get_or_create(
                                nombre=trabajo)
                            categorias_cache[trabajo] = obj
                        cat_obj = categorias_cache[trabajo]

                        # 2. Obtener o crear Nivel (Caché local combinado)
                        nivel_key = f"{trabajo}-{nivel_nombre}"
                        if nivel_key not in niveles_cache:
                            obj, _ = Nivel.objects.get_or_create(
                                categoria=cat_obj, nombre=nivel_nombre)
                            niveles_cache[nivel_key] = obj
                        niv_obj = niveles_cache[nivel_key]

                        # 3. Crear el Elemento
                        # Usamos update_or_create por si el dato cambió en el CSV
                        item, created = Elemento.objects.update_or_create(
                            nivel=niv_obj,
                            detalle=detalle,
                            defaults={'valor': valor, 'unidad': unidad}
                        )

                        if created:
                            creados += 1

            self.stdout.write(self.style.SUCCESS(
                f"Proceso terminado. Se crearon {creados} elementos nuevos."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error crítico: {e}"))
