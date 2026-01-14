from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UsuarioComun, UsuarioAdmin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = None
        print("Attempting to authenticate user:", username)

        try:
            admin = UsuarioAdmin.objects.get(username=username)
            if admin.check_password(password):
                user = admin
        except UsuarioAdmin.DoesNotExist:
            pass

        if user is None:
            try:
                comun = UsuarioComun.objects.get(rnic=username)
                if comun.check_password(password):
                    user = comun
            except UsuarioComun.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError(
                {"detail": "Usuario o contraseña incorrectos"})

        refresh = self.get_token(user)
        data = {"refresh": str(refresh), "access": str(refresh.access_token)}
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['rol'] = getattr(user, 'rol', 'Usuario')
        if hasattr(user, 'nombre'):
            token['name'] = user.nombre
        return token


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = RefreshToken(attrs['refresh'])
        # data = super().validate(attrs)
        print("Refreshing token for:", refresh.payload)
        rol = refresh.payload.get('rol')
        user_id = refresh.payload.get('user_id')
        user = None

        if rol in ['admin_ciudad', 'admin_general']:
            try:
                user = UsuarioAdmin.objects.get(id=user_id)
            except UsuarioAdmin.DoesNotExist:
                raise AuthenticationFailed(
                    "El cliente no existe.", code='user_not_found')
        elif rol == 'Usuario':
            try:
                user = UsuarioComun.objects.get(id=user_id)
            except UsuarioComun.DoesNotExist:
                raise AuthenticationFailed(
                    "El cliente no existe.", code='user_not_found')
        if user and not user.is_active:
            raise AuthenticationFailed(
                "El usuario está inactivo.", code='user_inactive')

        access_token = refresh.access_token
        access_token['rol'] = rol
        if refresh.payload.get('name'):
            access_token['name'] = refresh.payload.get('name')
        data = {"access": str(access_token)}
        return data

class UsuarioComunSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioComun
        fields = [
            'id', 'rnic', 'rni', 'nombre', 'fecha_inscripcion',
            'departamento', 'especialidad', 'celular', 'imagen',
            'registro_empleado', 'estado', 'certificaciones',
            'mail', 'rol'
        ]
        read_only_fields = [
            'id', 'rnic', 'rni', 'fecha_inscripcion',
            'departamento', 'registro_empleado', 'estado', 'rol'
        ]

    def create(self, validated_data):
        rni = self.initial_data.get('rni')
        if rni:
            validated_data['password'] = make_password(rni)
        else:
            raise serializers.ValidationError({"rni": "Este campo es requerido para crear la contraseña."})

        print("Creating user with data:", validated_data)
        return super().create(validated_data)


    def update(self, instance, validated_data):
        if 'rni' in validated_data:
            validated_data['rni'] = make_password(validated_data['rni'])
        return super().update(instance, validated_data)


class UsuarioComunListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioComun
        fields = ['nombre', 'rnic', 'rni', 'fecha_inscripcion', 'celular',
                  'especialidad', 'departamento', 'registro_empleado', 'estado']
