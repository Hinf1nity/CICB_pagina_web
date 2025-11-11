from rest_framework import viewsets
from .models import Img
from .serializers import IMGSerializer

class IMGViewSet(viewsets.ModelViewSet):
    queryset = Img.objects.all()
    serializer_class = IMGSerializer
