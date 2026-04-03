from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VirtualLibraryViewSet, VirtualLibraryAdminViewSet

router = DefaultRouter()
router.register(r'virtual_library', VirtualLibraryViewSet,
                basename='virtual_library')  # /api/virtual_library/virtual_library/
router.register(r'virtual_library_admin', VirtualLibraryAdminViewSet,
                basename='virtual_library_admin')  # /api/virtual_library/virtual_library_admin/

urlpatterns = [
    path('', include(router.urls)),
]
