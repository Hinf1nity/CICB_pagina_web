from rest_framework import viewsets
from .models import ResourceChart
from .serializers import ResourceChartSerializer

class ResourceChartViewSet(viewsets.ModelViewSet):
    queryset = ResourceChart.objects.all()
    serializer_class = ResourceChartSerializer
