from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.db.models import Count, Q

from .models import User
from .serializers import UserSerializer
from stats.models import Stats
from stats.serializers import StatsSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserStatisticsView(APIView):

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]


    def calculate_stats(self):
            total_users = User.objects.count()

            specialties_data = list(User.objects.values('especialidad').annotate(
                count=Count('id')
            ).order_by('-count'))

            employed_users = User.objects.exclude(
                Q(registro_empleado__isnull=True) | Q(registro_empleado__exact='')
            ).count()

            employment_rate = 0
            if total_users > 0:
                employment_rate = (employed_users / total_users) * 100

            return {
                "total_users": total_users,
                "employed_users": employed_users,
                "employment_rate": round(employment_rate, 2),
                "specialties_breakdown": specialties_data
            }
    
    def get(self, request):
        data = self.calculate_stats()
        return Response(data)

    def post(self, request):
        data = self.calculate_stats()

        stat_instance = Stats.objects.create(
            total_users=data['total_users'],
            employed_users=data['employed_users'],
            employment_rate=data['employment_rate'],
            specialties_breakdown=data['specialties_breakdown']
        )

        serializer = StatsSerializer(stat_instance)
        return Response(serializer.data, status=201)