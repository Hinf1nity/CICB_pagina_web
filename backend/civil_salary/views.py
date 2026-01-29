from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ReporteGeneralSerializer


class CalculateArancelViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = ReporteGeneralSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
