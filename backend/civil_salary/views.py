from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import IncidenciasLaborales, CategoriaRendimiento
from .serializers import ArancelesPostSerializer, IncidenciasLaboralesSerializer, CategoriaRendimientoSerializer


class CalculateArancelViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='calculate-arancel')
    def calculate_arancel(self, request):
        serializer = ArancelesPostSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            print("Calculating arancel with data:", data)
            if (data['antiguedad'] <= 5):
                antiguedad = 'junior'
            elif (5 < data['antiguedad'] <= 15):
                antiguedad = 'pleno'
            else:
                antiguedad = 'senior'
            salario_base = IncidenciasLaborales.objects.get(
                nombre='salario_mensual_base').valor
            ipc_nacional = IncidenciasLaborales.objects.get(
                nombre='ipc_nacional').valor
            fce_departamento = IncidenciasLaborales.objects.get(
                nombre=f"fce_{data['departamento']}").valor
            ipc_departamento = IncidenciasLaborales.objects.get(
                nombre=f"ipc_{data['departamento']}").valor
            factor_formacion = IncidenciasLaborales.objects.get(
                nombre=f"{data['formacion'].lower()}").valor
            factor_antiguedad = IncidenciasLaborales.objects.get(
                nombre=f"{antiguedad}_{data['ubicacion'].lower()}").valor
            factor_tipo_actividad = IncidenciasLaborales.objects.get(
                nombre=f"{data['actividad'].lower()}").valor
            factor_departamental = float(
                fce_departamento) * (float(ipc_departamento) / float(ipc_nacional))
            arancel_calculado = float(salario_base) * float(factor_antiguedad) * float(factor_formacion) * \
                float(factor_departamental) * float(factor_tipo_actividad)
            arancel_calculado = round(arancel_calculado, 3)
            arancel_hora = round(arancel_calculado / 240, 3)
            arancel_dia = round(arancel_hora * 8, 3)
            print("Calculated arancel:", arancel_calculado)
            response = {'mensual': arancel_calculado,
                        'hora': arancel_hora, 'dia': arancel_dia}
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
