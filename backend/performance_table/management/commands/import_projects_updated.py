import hashlib
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from performance_table.models import PerformanceTable, QuantifiedResource, ResourceChart

class Command(BaseCommand):
    help = "Importa proyectos masivamente leyendo formato jerárquico y optimizando la BD"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, required=True, help="Ruta del archivo Excel")

    def handle(self, *args, **options):
        ruta = options["file"]
        self.stdout.write(f"Iniciando importación masiva desde: {ruta}")

        try:
            df = pd.read_excel(ruta, header=None).fillna("")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error leyendo el archivo Excel: {e}"))
            return

        rows = []
        current_task_name = ""
        current_task_unit = ""


        for index, row in df.iterrows():
            col1_name = str(row[1]).strip() if len(row) > 1 else ""
            col2_rendimiento = str(row[2]).strip() if len(row) > 2 else ""
            col3_unidad = str(row[3]).strip() if len(row) > 3 else ""

            if not col1_name or col1_name.lower() in ["recursos", "cadeco 2024"]:
                continue
            
            if col2_rendimiento.lower() == "rendimiento" or col3_unidad.lower() == "unidad":
                continue

            if col2_rendimiento == "" and col3_unidad != "":
                current_task_name = col1_name
                current_task_unit = col3_unidad
            
            elif col2_rendimiento != "":
                if not current_task_name:
                    continue  
                    
                try:
                    rendimiento_val = float(col2_rendimiento)
                except ValueError:
                    continue  

                rows.append({
                    "tarea_nombre": current_task_name,
                    "tarea_unidad": current_task_unit,
                    "recurso_nombre": col1_name,
                    "recurso_rendimiento": rendimiento_val,
                    "recurso_unidad": col3_unidad
                })

        if not rows:
            self.stdout.write(self.style.WARNING("El archivo está vacío o no tiene datos válidos."))
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
                rendimiento = row["recurso_rendimiento"]
                
                if not t_obj or not r_obj:
                    continue
                    
                pair_key = (t_obj.id, r_obj.id)
                
                if pair_key in processed_pairs:
                    continue
                processed_pairs.add(pair_key)

                if pair_key in qr_map:
                    qr = qr_map[pair_key]
                    if abs(getattr(qr, 'rendimiento', 0.0) - rendimiento) > 0.0001: 
                        qr.cantidad = str(rendimiento) 
                        qr_to_update.append(qr)
                else:
                    qr_to_create.append(QuantifiedResource(
                        performance_table=t_obj,
                        recurso=r_obj,
                        cantidad=str(rendimiento)
                    ))

            if qr_to_create:
                QuantifiedResource.objects.bulk_create(qr_to_create)
                self.stdout.write(f"   + Se asignaron {len(qr_to_create)} nuevos recursos a tareas.")
            
            if qr_to_update:
                QuantifiedResource.objects.bulk_update(qr_to_update, ['cantidad'])
                self.stdout.write(f"   ~ Se actualizaron rendimientos en {len(qr_to_update)} asignaciones.")

        self.stdout.write(self.style.SUCCESS("Importación finalizada con éxito."))