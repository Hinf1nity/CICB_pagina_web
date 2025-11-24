from rest_framework import viewsets
from .models import Stats
from .serializers import StatsSerializer

class StatsViewSet(viewsets.ModelViewSet):
    queryset = Stats.objects.all()
    serializer_class = StatsSerializer
