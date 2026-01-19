
from .models import PerformanceTable, ResourceChart
from .serializers import PerformanceTableSerializer, ResourceSerializer

from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from resource_chart.models import ResourceChart
from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class PerformanceTableViewSet(viewsets.ModelViewSet):
    queryset = PerformanceTable.objects.all().order_by('-id')
    serializer_class = PerformanceTableSerializer
    pagination_class = TwentyPerPagePagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


class ResourcesViewSet(viewsets.ModelViewSet):
    queryset = ResourceChart.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)

        if not is_many:
            return super().create(request, *args, **kwargs)

        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
