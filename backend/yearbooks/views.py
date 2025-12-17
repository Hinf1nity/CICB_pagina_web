from rest_framework import viewsets
from .models import Yearbook
from .serializers import YearbookSerializer
from rest_framework.permissions import AllowAny, IsAdminUser

class YearbookViewSet(viewsets.ModelViewSet):
    queryset = Yearbook.objects.all()
    serializer_class = YearbookSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]