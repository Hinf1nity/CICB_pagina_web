from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalculateArancelViewSet

router = DefaultRouter()
router.register(r'civil_salary', CalculateArancelViewSet,
                basename='civil_salary')  # /api/civil_salary/

urlpatterns = [
    path('', include(router.urls)),
]
