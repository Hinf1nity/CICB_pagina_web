from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import YearbookViewSet

router = DefaultRouter()
router.register(r'', YearbookViewSet)  # /api/yearbooks/

urlpatterns = [
    path('', include(router.urls)),
]
