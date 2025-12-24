from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PerformanceTableViewSet

router = DefaultRouter()
router.register(r'', PerformanceTableViewSet)

urlpatterns = [
    path('', include(router.urls)),
]