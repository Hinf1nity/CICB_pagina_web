
from .models import PerformanceTable, ResourceChart
from .serializers import PerformanceTableSerializer, ResourceSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


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
        queryset = PerformanceTable.objects.all().order_by('-id')
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
