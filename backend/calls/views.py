from rest_framework import viewsets
from .models import Call
from .serializers import CallSerializer,CallListSerializer
from rest_framework.permissions import AllowAny, IsAdminUser

class CallViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    serializer_class = CallSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CallListSerializer
        return CallSerializer
