from rest_framework import viewsets
from .models import PDF
from .serializers import PDFSerializer

class PDFViewSet(viewsets.ModelViewSet):
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
