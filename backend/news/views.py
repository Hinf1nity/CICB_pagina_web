from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import News
from .serializers import NewsListSerializer, NewsDetailSerializer, NewsAdminSerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()

    def get_serializer_class(self):

        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return NewsAdminSerializer
            
        elif self.action == 'list':
            return NewsListSerializer
        
        return NewsDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
