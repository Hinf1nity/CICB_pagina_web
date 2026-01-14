from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import YearbookViewSet, YearbookAdminViewSet

router = DefaultRouter()
router.register(r'yearbooks', YearbookViewSet,
                basename='yearbooks')  # /api/yearbooks/yearbooks/
router.register(r'yearbooks_admin', YearbookAdminViewSet,
                basename='yearbooks_admin')  # /api/yearbooks/yearbooks_admin/

urlpatterns = [
    path('', include(router.urls)),
]
