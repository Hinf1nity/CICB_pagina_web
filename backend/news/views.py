from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import News
from .serializers import (
    NewsAdminDetailSerializer,
    NewsAdminListSerializer,
    NewsDetailSerializer,
    NewsListSerializer,
    NewsAdminGeneralSerializer
)

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListSerializer
        return NewsDetailSerializer

class NewsAdminViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsAdminListSerializer
        
        if self.action == 'retrieve':
            return NewsAdminDetailSerializer
        
        return NewsAdminGeneralSerializer