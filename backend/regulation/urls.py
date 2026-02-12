from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegulationViewSet, RegulationAdminViewSet

router = DefaultRouter()
router.register(r'regulation', RegulationViewSet,
                basename='regulation')  # /api/regulation/regulation/
router.register(r'regulation_admin', RegulationAdminViewSet,
                basename='regulation_admin')  # /api/regulation/regulation_admin/

urlpatterns = [
    path('', include(router.urls)),
]
