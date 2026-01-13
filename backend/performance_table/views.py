from .models import PerformanceTable
from .serializers import PerformanceTableSerializer, BulkResourceInputSerializer

from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from resource_chart.models import ResourceChart

class PerformanceTableViewSet(viewsets.ModelViewSet):
    queryset = PerformanceTable.objects.all()
    serializer_class = PerformanceTableSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
class BulkResourceCreateView(APIView):
    def post(self, request):
        serializer = BulkResourceInputSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            ids_list = []
            
            for item in serializer.validated_data:
                name = item['nombre']
                unit = item['unidad']
                
                obj, created = ResourceChart.objects.get_or_create(
                    nombre=name,
                    defaults={'unidad': unit}
                )
                
                ids_list.append(obj.id)
            
            return Response(ids_list, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)