from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Job
from .serializers import JobListSerializer, JobDetailSerializer, JobAdminSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()

    def get_serializer_class(self):

        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return JobAdminSerializer
    
        elif self.action == 'list':
            return JobListSerializer
            
        return JobDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
