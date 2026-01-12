from rest_framework import permissions

class IsAdminPrin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser

class IsAdminSec(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "rol", None) == "admin_ciudad"

class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        is_user = (
            not request.user.is_superuser and getattr(request.user, "rol", None) != "admin_ciudad")

        if not is_user:
            return False

        return request.method not in ["POST", "DELETE"]

class IsPublic(permissions.BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_authenticated
