from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserDetails

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')  # /api/users/

urlpatterns = [
    path('details/<int:pk>/', UserDetails.as_view({'get': 'retrieve'}), name='user_details'),
    path('', include(router.urls)),
]
