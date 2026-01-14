from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CallViewSet, CallAdminViewSet

router = DefaultRouter()
router.register(r'calls', CallViewSet, basename='calls')  # /api/calls/calls/
router.register(r'calls_admin', CallAdminViewSet,
                basename='calls_admin')  # /api/calls/calls_admin/


urlpatterns = [
    path('', include(router.urls)),
]
