from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import News
from .serializers import NewsSerializer

class AdminNewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        print("New created by an admin")
        serializer.save()
