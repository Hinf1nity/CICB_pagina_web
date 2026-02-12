from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.serializers import MyTokenObtainPairSerializer, CustomTokenRefreshSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
