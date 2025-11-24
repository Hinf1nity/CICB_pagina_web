from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.db.models import Count, Q, Case, When, IntegerField
from django.utils import timezone
from datetime import timedelta

from .models import User
from .serializers import UserSerializer
from stats.models import Stats
from stats.serializers import StatsSerializer

def calculate_current_metrics():
    """Calculates only the current status of the DB (Fast)"""
    total_users = User.objects.count()
    
    specialties_data = list(User.objects.values('especialidad').annotate(
        count=Count('id')
    ).order_by('-count'))

    state_data = list(User.objects.values('departamento').annotate(
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
        "specialties_breakdown": specialties_data,
        "state_breakdown": state_data
    }

def calculate_growth_metrics():
    today = timezone.now().date()
    one_year_ago = today - timedelta(days=365)
    
    current_total = User.objects.count()
    
    users_last_year = User.objects.filter(fecha_inscripcion__lte=one_year_ago).count()
    total_growth = 0
    if users_last_year > 0:
        total_growth = ((current_total - users_last_year) / users_last_year) * 100

    current_employed = User.objects.exclude(
        Q(registro_empleado__isnull=True) | Q(registro_empleado__exact='')
    ).count()
    
    current_rate = (current_employed / current_total * 100) if current_total > 0 else 0

    past_stat = Stats.objects.filter(
        created_at__lte=timezone.now() - timedelta(days=360)
    ).order_by('-created_at').first()

    past_rate = past_stat.employment_rate if past_stat else 0
    
    emp_growth = 0
    if past_rate > 0:
        emp_growth = ((current_rate - past_rate) / past_rate) * 100

    state_growth_qs = User.objects.values('departamento').annotate(
        current_count=Count('id'),
        last_year_count=Count(
            Case(
                When(fecha_inscripcion__lte=one_year_ago, then=1),
                output_field=IntegerField()
            )
        )
    )

    state_growth_data = []
    for item in state_growth_qs:
        past = item['last_year_count']
        current = item['current_count']
        growth = ((current - past) / past * 100) if past > 0 else 0
        
        state_growth_data.append({
            "departamento": item['departamento'],
            "current_count": current,
            "growth_percentage": round(growth, 2)
        })

    return {
        "total_users_growth": round(total_growth, 2),
        "employment_rate_growth": round(emp_growth, 2),
        "state_growth_breakdown": state_growth_data
    }

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserStatisticsView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        data = calculate_current_metrics()
        return Response(data)

    def post(self, request):
        current_data = calculate_current_metrics()
        growth_data = calculate_growth_metrics()

        full_data = {**current_data, **growth_data}

        stat_instance = Stats.objects.create(
            total_users=full_data['total_users'],
            employed_users=full_data['employed_users'],
            employment_rate=full_data['employment_rate'],
            specialties_breakdown=full_data['specialties_breakdown'],
            state_breakdown=full_data['state_breakdown'],
            total_users_growth=full_data['total_users_growth'],
            employment_rate_growth=full_data['employment_rate_growth'],
            state_growth_breakdown=full_data['state_growth_breakdown']
        )

        serializer = StatsSerializer(stat_instance)
        return Response(serializer.data, status=201)

class UserGrowthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = calculate_growth_metrics()
        return Response(data)