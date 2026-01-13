from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import YearbookViewSet, YearbookAdminViewSet

router = DefaultRouter()
router.register(r'yearbook', YearbookViewSet, basename='yearbook')
router.register(r'yearbook_admin', YearbookAdminViewSet, basename='yearbook_admin')

urlpatterns = [
    path('', include(router.urls)),
]
