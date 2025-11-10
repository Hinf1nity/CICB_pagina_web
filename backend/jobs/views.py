from rest_framework import viewsets
from .models import Job
from .serializers import JobListSerializer, JobDetailSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        elif self.action == 'retrieve':
            return JobDetailSerializer
        return JobDetailSerializer
