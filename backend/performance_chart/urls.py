from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PerformanceChartViewSet

router = DefaultRouter()
router.register(r'', PerformanceChartViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
