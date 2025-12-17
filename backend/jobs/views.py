from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Job
from .serializers import (
    JobListSerializer,
    JobDetailSerializer,
    JobAdminGeneralSerializer,
    JobAdminDetailSerializer,
    JobAdminListSerializer
)

class JobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobDetailSerializer

class JobAdminViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return JobAdminListSerializer
        
        if self.action == 'retrieve':
            return JobAdminDetailSerializer
        
        return JobAdminGeneralSerializer
