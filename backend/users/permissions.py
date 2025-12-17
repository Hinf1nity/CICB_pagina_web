from rest_framework import permissions

class IsAdminPrin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Administrador principal").exists()

class IsAdminSec(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Administrador secundario").exists()

class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Usuario").exists()

class IsPublic(permissions.BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_authenticated
