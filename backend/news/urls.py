from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsViewSet, NewsAdminViewSet

router = DefaultRouter()
router.register(r'news', NewsViewSet, basename='news')
router.register(r'news_admin', NewsAdminViewSet, basename='news_admin')

urlpatterns = [
    path('', include(router.urls)),
]
