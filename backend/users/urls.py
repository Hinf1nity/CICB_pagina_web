from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserStatisticsView, UserGrowthView

router = DefaultRouter()
router.register(r'', UserViewSet)  # /api/users/

urlpatterns = [
    path('stats/', UserStatisticsView.as_view(), name='user_stats'),
    path('stats/growth/', UserGrowthView.as_view(), name='user_growth'),
    path('', include(router.urls)),
]