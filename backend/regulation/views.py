from rest_framework import viewsets
from .models import Regulation
from .serializers import RegulationSerializer
from rest_framework.permissions import AllowAny, IsAdminUser

class RegulationViewSet(viewsets.ModelViewSet):
    queryset = Regulation.objects.all()
    serializer_class = RegulationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]