from rest_framework import viewsets
from .models import Regulation
from .serializers import RegulationSerializer

class RegulationViewSet(viewsets.ModelViewSet):
    queryset = Regulation.objects.all()
    serializer_class = RegulationSerializer
