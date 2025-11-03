from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_admin import AdminJobViewSet

router = DefaultRouter()
router.register(r'', AdminJobViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
