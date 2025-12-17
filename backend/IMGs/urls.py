from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IMGViewSet

router = DefaultRouter()
router.register(r'', IMGViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
