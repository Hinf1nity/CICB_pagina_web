from rest_framework import viewsets
from .models import Yearbook
from .serializers import YearbookSerializer

class YearbookViewSet(viewsets.ModelViewSet):
    queryset = Yearbook.objects.all()
    serializer_class = YearbookSerializer
