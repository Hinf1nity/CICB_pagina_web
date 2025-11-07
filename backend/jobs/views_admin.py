from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Job
from .serializers import JobSerializer

class AdminJobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        print("Job created by an admin")
        serializer.save()
