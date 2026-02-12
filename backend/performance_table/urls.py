from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PerformanceTableViewSet, ResourcesViewSet

router = DefaultRouter()
router.register(r'performance', PerformanceTableViewSet,
                basename='performance')
router.register(r'resources', ResourcesViewSet, basename='resources')

urlpatterns = [
    path('', include(router.urls)),
]
