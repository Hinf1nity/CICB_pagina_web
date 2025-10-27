from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceChartViewSet

router = DefaultRouter()
router.register(r'', ResourceChartViewSet)  # /api/resource_chart/

urlpatterns = [
    path('', include(router.urls)),
]
