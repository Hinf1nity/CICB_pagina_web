from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StatsViewSet, 
    UserStatisticsView, 
    UserGrowthView,
    OverallStatsView
)

router = DefaultRouter()
router.register(r'', StatsViewSet)

urlpatterns = [
    path('users/', UserStatisticsView.as_view(), name='user_stats'),
    path('growth/', UserGrowthView.as_view(), name='user_growth'),
    path('overall/', OverallStatsView.as_view(), name='general_stats'),
    path('', include(router.urls)),
]