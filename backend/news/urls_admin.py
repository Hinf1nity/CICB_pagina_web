from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_admin import AdminNewsViewSet

router = DefaultRouter()
router.register(r'', AdminNewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
