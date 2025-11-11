from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PDFViewSet

router = DefaultRouter()
router.register(r'', PDFViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
