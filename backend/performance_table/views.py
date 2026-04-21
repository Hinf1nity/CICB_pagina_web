from os import path
from xhtml2pdf import pisa
from django.conf import settings
from django.http import HttpResponse
from .models import PerformanceTable, ResourceChart
from .serializers import PerformanceTablePDFSerializer, PerformanceTableSerializer, ResourceSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status
from django.template.loader import get_template
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from django.contrib.staticfiles import finders


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class TwentyPerPagePaginationPerformance(PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        total_resources = ResourceChart.objects.count()
        total_categories = PerformanceTable.objects.values(
            'categoria').distinct().count()
        categories_names = PerformanceTable.objects.values_list(
            'categoria', flat=True).distinct()

        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
            'total_resources': total_resources,
            'total_categories': total_categories,
            'categories_names': list(categories_names),
        })


class PerformanceTableViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceTableSerializer
    pagination_class = TwentyPerPagePaginationPerformance
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['categoria']
    search_fields = ['actividad', 'codigo', 'recursos__nombre']

    def get_queryset(self):
        queryset = PerformanceTable.objects.prefetch_related(
            'quantifiedresource_set__recurso').all().order_by('-id')
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


class ResourcesViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nombre']
    permission_classes = [AllowAny]
    pagination_class = TwentyPerPagePagination

    def get_queryset(self):
        queryset = ResourceChart.objects.all().order_by('-id')
        return queryset

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        if not is_many:
            return super().create(request, *args, **kwargs)

        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


def obtener_ruta_logo():
    # Buscamos el archivo en el sistema de archivos de Django
    relative_path = 'img/logo_cicb.png'
    absolute_path = finders.find(relative_path)

    if absolute_path:
        return absolute_path

    # Fallback por si acaso: buscar en STATIC_ROOT si finder falla (en prod)
    return path.join(settings.STATIC_ROOT, relative_path)


class GeneretePerformanceReportPDF(viewsets.ViewSet):
    queryset = PerformanceTable.objects.prefetch_related(
        'quantifiedresource_set__recurso').all()
    # serializer_class = PerformanceTablePDFSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='generar-pdf')
    def generar_pdf(self, request):
        ids = request.data.get('ids', [])

        if not ids:
            return Response({"error": "No se enviaron IDs"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Obtener datos optimizados
        actividades = PerformanceTable.objects.filter(id__in=ids).prefetch_related(
            'quantifiedresource_set__recurso')
        if not actividades.exists():
            return Response({"error": "No se encontraron actividades con los IDs proporcionados"}, status=status.HTTP_404_NOT_FOUND)
        actividades = self.marcar_saltos_pagina(actividades)

        # 2. Configurar el logo y contexto
        logo_path = obtener_ruta_logo()
        context = {
            'actividades': actividades,
            'logo_path': logo_path,
        }

        # 3. Renderizar PDF
        template = get_template('pdf/report_performance.html')
        html = template.render(context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="reporte_rendimientos_cicb.pdf"'

        pisa_status = pisa.CreatePDF(html, dest=response)

        if pisa_status.err:
            return Response({'error': 'Error al generar el PDF'}, status=500)

        return response

    def marcar_saltos_pagina(self, actividades):
        """
        Estima la altura de cada actividad y marca cuáles deben
        comenzar en nueva página para evitar que se partan.
        """
        ALTURA_PAGINA_PX = 580   # altura útil aprox. en puntos (carta - márgenes)
        ALTURA_CABECERA = 28    # fila del título de la actividad
        ALTURA_FILA = 20    # cada fila de recurso
        ALTURA_MARGEN = 40    # padding + separación entre bloques

        altura_acumulada = 0

        for item in actividades:
            # Contar filas por categoría
            recursos = item.quantifiedresource_set.all()
            n_mat = sum(
                1 for r in recursos if r.recurso.categoria == 'Materiales')
            n_obra = sum(
                1 for r in recursos if r.recurso.categoria == 'Mano de Obra')
            n_herr = sum(1 for r in recursos if r.recurso.categoria ==
                         'Herramientas y Equipo')

            filas_max = max(n_mat, n_obra, n_herr, 1)
            altura_item = ALTURA_CABECERA + \
                (filas_max * ALTURA_FILA) + ALTURA_MARGEN

            # ¿No cabe en lo que queda de página?
            if altura_acumulada + altura_item > ALTURA_PAGINA_PX:
                item.forzar_salto = True
                altura_acumulada = altura_item   # reinicia con este bloque
            else:
                item.forzar_salto = False
                altura_acumulada += altura_item

        return actividades
