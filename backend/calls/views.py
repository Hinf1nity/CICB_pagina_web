from rest_framework import viewsets
from .models import Call
from .serializers import CallSerializer

class CallViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    serializer_class = CallSerializer
