from rest_framework import viewsets
from .models import PerformanceChart
from .serializers import PerformanceChartSerializer

class PerformanceChartViewSet(viewsets.ModelViewSet):
    queryset = PerformanceChart.objects.all()
    serializer_class = PerformanceChartSerializer
