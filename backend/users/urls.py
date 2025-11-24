from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserStatisticsView

router = DefaultRouter()
router.register(r'', UserViewSet)  # /api/users/

urlpatterns = [
    path('stats/', UserStatisticsView.as_view(), name='user_stats'),
    path('', include(router.urls)),
]