from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CallViewSet, CallAdminViewSet

router = DefaultRouter()
router.register(r'call', CallViewSet, basename='call')
router.register(r'call_admin', CallAdminViewSet, basename='call_admin')

urlpatterns = [
    path('', include(router.urls)),
]
