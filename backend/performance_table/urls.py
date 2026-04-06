from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PerformanceTableViewSet, ResourcesViewSet, GeneretePerformanceReportPDF

router = DefaultRouter()
router.register(r'performance', PerformanceTableViewSet,
                basename='performance')
router.register(r'resources', ResourcesViewSet, basename='resources')
router.register(r'generate_report', GeneretePerformanceReportPDF,
                basename='generate_report')

urlpatterns = [
    path('', include(router.urls)),
]
