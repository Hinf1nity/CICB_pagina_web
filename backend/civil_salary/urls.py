from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalculateArancelViewSet, IncidenciasAdminViewSet, CategoriaAdminViewSet

router = DefaultRouter()
router.register(r'aranceles', CalculateArancelViewSet,
                basename='aranceles')  # /api/aranceles/aranceles
router.register(r'incidencias-admin', IncidenciasAdminViewSet,
                basename='incidencias-admin')  # /api/aranceles/incidencias-admin
router.register(r'categorias-admin', CategoriaAdminViewSet,
                basename='categorias-admin')  # /api/aranceles/categorias
urlpatterns = [
    path('', include(router.urls)),
]
