import csv
import hashlib
import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from performance_table.models import PerformanceTable, QuantifiedResource, ResourceChart

class Command(BaseCommand):
    help = "Importa proyectos masivamente optimizando consultas a la BD"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, required=True, help="Ruta del archivo")
        parser.add_argument("--encoding", type=str, default="utf-8-sig", help="Encoding")

    def handle(self, *args, **options):
        ruta = options["file"]
        encoding = options["encoding"]
        temp_csv_created = False
        
        self.stdout.write(f"Iniciando importación masiva desde: {ruta}")

        if ruta.lower().endswith(('.xlsx', '.xls')):
            self.stdout.write("   > Detectado archivo Excel. Convirtiendo a CSV...")
            try:
                df = pd.read_excel(ruta).fillna("")
                new_csv_path = os.path.splitext(ruta)[0] + "_temp_import.csv"
                df.to_csv(new_csv_path, index=False, encoding=encoding)
                ruta = new_csv_path
                temp_csv_created = True
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error convirtiendo Excel: {e}"))
                return

        try:
            rows = []
            with open(ruta, newline="", encoding=encoding) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    t_nombre = row.get("TAREA", "").strip()
                    r_nombre = row.get("RECURSO", "").strip()
                    
                    if t_nombre and r_nombre:
                        rows.append({
                            "tarea_nombre": t_nombre,
                            "tarea_unidad": row.get("UNIDAD", "").strip(),
                            "recurso_nombre": r_nombre,
                            "recurso_cant": float(row.get("CANT", "0").strip() or 0),
                            "recurso_unidad": row.get("UNID", "").strip()
                        })

            if not rows:
                self.stdout.write("El archivo está vacío o no tiene datos válidos.")
                return

            unique_task_names = set(r["tarea_nombre"] for r in rows)
            unique_res_names = set(r["recurso_nombre"] for r in rows)

            with transaction.atomic():
                self.stdout.write(" > Procesando Tareas (PerformanceTable)...")
                
                existing_tasks = PerformanceTable.objects.filter(actividad__in=unique_task_names)
                task_map = {t.actividad: t for t in existing_tasks}
                
                tasks_to_create = []
                for name in unique_task_names:
                    if name not in task_map:
                        code_hash = hashlib.md5(name.encode()).hexdigest()[:6].upper()
                        generated_code = f"TAR-{code_hash}"
                        
                        unit = next((r["tarea_unidad"] for r in rows if r["tarea_nombre"] == name), "")
                        
                        tasks_to_create.append(
                            PerformanceTable(
                                actividad=name,
                                unidad=unit,
                                codigo=generated_code,
                                categoria='Importado'
                            )
                        )
                
                if tasks_to_create:
                    PerformanceTable.objects.bulk_create(tasks_to_create)
                    self.stdout.write(f"   + Se crearon {len(tasks_to_create)} nuevas tareas.")
                    
                    all_tasks = PerformanceTable.objects.filter(actividad__in=unique_task_names)
                    task_map = {t.actividad: t for t in all_tasks}

                self.stdout.write(" > Procesando Recursos (ResourceChart)...")
                
                existing_resources = ResourceChart.objects.filter(nombre__in=unique_res_names)
                res_map = {r.nombre: r for r in existing_resources}
                
                res_to_create = []
                res_to_update = []
                
                for name in unique_res_names:
                    unit = next((r["recurso_unidad"] for r in rows if r["recurso_nombre"] == name), "")
                    
                    if name not in res_map:
                        res_to_create.append(ResourceChart(nombre=name, unidad=unit))
                    else:
                        res = res_map[name]
                        if unit and res.unidad != unit:
                            res.unidad = unit
                            res_to_update.append(res)
                
                if res_to_create:
                    ResourceChart.objects.bulk_create(res_to_create)
                    self.stdout.write(f"   + Se crearon {len(res_to_create)} nuevos recursos.")
                
                if res_to_update:
                    ResourceChart.objects.bulk_update(res_to_update, ['unidad'])
                    self.stdout.write(f"   ~ Se actualizaron {len(res_to_update)} recursos.")

                all_resources = ResourceChart.objects.filter(nombre__in=unique_res_names)
                res_map = {r.nombre: r for r in all_resources}

                self.stdout.write(" > Procesando Asignaciones (QuantifiedResource)...")
                
                existing_qrs = QuantifiedResource.objects.filter(
                    performance_table__in=task_map.values(),
                    recurso__in=res_map.values()
                )
                
                qr_map = {(q.performance_table_id, q.recurso_id): q for q in existing_qrs}
                
                qr_to_create = []
                qr_to_update = []
                processed_pairs = set()

                for row in rows:
                    t_obj = task_map.get(row["tarea_nombre"])
                    r_obj = res_map.get(row["recurso_nombre"])
                    cant = row["recurso_cant"]
                    
                    if not t_obj or not r_obj:
                        continue
                        
                    pair_key = (t_obj.id, r_obj.id)
                    
                    if pair_key in processed_pairs:
                        continue
                    processed_pairs.add(pair_key)

                    if pair_key in qr_map:
                        qr = qr_map[pair_key]
                        if abs(qr.cantidad - cant) > 0.0001: 
                            qr.cantidad = cant
                            qr_to_update.append(qr)
                    else:
                        qr_to_create.append(QuantifiedResource(
                            performance_table=t_obj,
                            recurso=r_obj,
                            cantidad=cant
                        ))

                if qr_to_create:
                    QuantifiedResource.objects.bulk_create(qr_to_create)
                    self.stdout.write(f"   + Se asignaron {len(qr_to_create)} nuevos recursos a tareas.")
                
                if qr_to_update:
                    QuantifiedResource.objects.bulk_update(qr_to_update, ['cantidad'])
                    self.stdout.write(f"   ~ Se actualizaron cantidades en {len(qr_to_update)} asignaciones.")

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"No se encontró el archivo: {ruta}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error crítico: {str(e)}"))
        
        finally:
            if temp_csv_created and os.path.exists(ruta):
                os.remove(ruta)
                self.stdout.write("Limpieza de temporales completada.")
