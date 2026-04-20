import csv
import gc
from django.db import transaction, connection
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import UsuarioComun, generate_unique_rnic
from datetime import datetime


class Command(BaseCommand):
    help = "Importa usuarios comunes desde un CSV de forma eficiente"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, required=True)
        parser.add_argument(
            "--batch",
            type=int,
            default=1000,
            help="Número de registros a procesar por batch (default: 1000)"
        )

    def handle(self, *args, **options):
        ruta = options["file"]
        BATCH_SIZE = options["batch"]

        self.stdout.write("Indexando registros existentes...")
        existentes = set(UsuarioComun.objects.values_list('rni', flat=True))
        proximos_rnic = {}

        nuevos_usuarios = []
        total_creados = 0

        with open(ruta, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                rni = row["rni"].strip()
                depto = row.get("departamento", "").strip()

                if rni in existentes:
                    continue

                if depto not in proximos_rnic:
                    try:
                        proximos_rnic[depto] = generate_unique_rnic(depto)
                    except ValueError:
                        self.stdout.write(self.style.ERROR(
                            f"Depto inválido: {depto}"))
                        continue
                else:
                    proximos_rnic[depto] += 1

                fecha_raw = row.get("fecha_inscripcion", "").strip()
                fecha_procesada = None
                if fecha_raw:
                    try:
                        fecha_procesada = datetime.strptime(
                            fecha_raw, "%d/%m/%Y").date()
                    except ValueError:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Formato de fecha inválido para RNI {rni}: '{fecha_raw}'. Se dejará en blanco.")
                        )
                        fecha_procesada = None

                usuario = UsuarioComun(
                    nombre=row["nombre"].strip(),
                    rni=rni,
                    rnic=proximos_rnic[depto],
                    departamento=depto,
                    especialidad=row.get("especialidad", "civil").strip(),
                    celular=row.get("celular", "").strip(),
                    mail=row.get("mail", "").strip(),
                    estado=row.get("estado", "activo").strip(),
                    fecha_inscripcion=fecha_procesada,
                    password=make_password(str(rni)),
                )

                nuevos_usuarios.append(usuario)
                existentes.add(rni)

                if len(nuevos_usuarios) >= BATCH_SIZE:
                    self.stdout.write(
                        f"Insertando {len(nuevos_usuarios)} usuarios...")
                    self.guardar_batch(nuevos_usuarios)
                    total_creados += len(nuevos_usuarios)
                    self.stdout.write(self.style.SUCCESS(
                        f"Éxito: Se crearon {total_creados} registros hasta ahora."))
                    nuevos_usuarios = []
                    gc.collect()
            if nuevos_usuarios:
                self.stdout.write(
                    f"Insertando {len(nuevos_usuarios)} usuarios...")
                self.guardar_batch(nuevos_usuarios)
                total_creados += len(nuevos_usuarios)
                self.stdout.write(self.style.SUCCESS(
                    f"Éxito: Se crearon {total_creados} registros en total."))

        if total_creados > 0:
            self.stdout.write(self.style.SUCCESS(
                f"Importación finalizada: Se crearon {total_creados} nuevos usuarios."))
        else:
            self.stdout.write(self.style.WARNING(
                "No se crearon nuevos usuarios."))

    def guardar_batch(self, lista_usuarios):
        """Función auxiliar para encapsular la transacción por batch"""
        try:
            with transaction.atomic():
                UsuarioComun.objects.bulk_create(lista_usuarios)
            connection.queries_log.clear()  # Limpiar el log de consultas para liberar memoria
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f"Error al insertar bloque: {e}"))
