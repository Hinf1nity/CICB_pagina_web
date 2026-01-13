from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PerformanceTableViewSet, BulkResourceCreateView

router = DefaultRouter()
router.register(r'', PerformanceTableViewSet)

urlpatterns = [
    path('bulk-upload/', BulkResourceCreateView.as_view(), name='resource-bulk-check'),
    path('', include(router.urls)),
]