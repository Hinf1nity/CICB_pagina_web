from django.core.management.base import BaseCommand
from civil_salary.models import IncidenciasLaborales


class Command(BaseCommand):
    help = "Crea los 9 administradores por ciudad"

    def handle(self, *args, **kwargs):
        incidencias_antiguedad_locacion = {
            "junior_ciudad": 1.80,
            "junior_campo": 2.30,
            "pleno_ciudad": 3.00,
            "pleno_campo": 3.50,
            "senior_ciudad": 4.20,
            "senior_campo": 4.70,
        }

        incidencias_formacion = {
            "form_Licenciatura": 1.00,
            "form_Diplomado": 1.02,
            "form_Especialidad": 1.03,
            "form_Maestría": 1.06,
            "form_Doctorado": 1.10,
        }

        incidencias_fce = {
            "fce_Santa Cruz": 1.20,
            "fce_La Paz": 1.10,
            "fce_Cochabamba": 1.10,
            "fce_Oruro": 1.05,
            "fce_Potosí": 1.00,
            "fce_Tarija": 1.05,
            "fce_Chuquisaca": 1.05,
            "fce_Beni": 1.00,
            "fce_Pando": 1.00,
        }

        incidencia_ipc_departamental = {
            "ipc_Chuquisaca": 143.38,
            "ipc_La Paz": 151.85,
            "ipc_Cochabamba": 147.48,
            "ipc_Oruro": 152.29,
            "ipc_Potosí": 153.35,
            "ipc_Tarija": 146.97,
            "ipc_Santa Cruz": 141.92,
            "ipc_Beni": 146.91,
            "ipc_Pando": 146.58,
        }

        incidencia_actividad = {
            "actividad_Diseño, planificación y ejecución": 1.00,
            "actividad_Supervisión, fiscalización y asesoría": 1.05,
            "actividad_Avalúo, peritaje, especialidad y docencia": 1.10,
        }

        incidencias = {
            "salario_mensual_base": 3300.00,
            "ipc_nacional": 147.14,
            **incidencias_antiguedad_locacion,
            **incidencias_formacion,
            **incidencias_fce,
            **incidencia_ipc_departamental,
            **incidencia_actividad,
        }

        for incidencia, valor in incidencias.items():
            if not IncidenciasLaborales.objects.filter(nombre=incidencia).exists():
                IncidenciasLaborales.objects.create(
                    nombre=incidencia,
                    valor=valor
                )
                self.stdout.write(self.style.SUCCESS(
                    f"Incidencia creada: {incidencia}"))
            else:
                self.stdout.write(self.style.WARNING(
                    f"{incidencia} ya existe"))
