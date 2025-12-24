from rest_framework import viewsets
from .models import PerformanceTable
from .serializers import PerformanceTableSerializer
from rest_framework.permissions import AllowAny, IsAdminUser

class PerformanceTableViewSet(viewsets.ModelViewSet):
    queryset = PerformanceTable.objects.all()
    serializer_class = PerformanceTableSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]