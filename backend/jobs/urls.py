from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobAdminViewSet

router = DefaultRouter()
router.register(r'job', JobViewSet, basename='job')
router.register(r'job_admin', JobAdminViewSet, basename='job_admin')
urlpatterns = [
    path('', include(router.urls)),
]
