from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UsuarioComun, UsuarioAdmin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = None

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
            raise serializers.ValidationError({"detail": "Usuario o contraseña incorrectos"})

        refresh = self.get_token(user)
        data = {"refresh": str(refresh), "access": str(refresh.access_token)}
        data['rol'] = getattr(user, 'rol', 'Usuario')
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['rol'] = getattr(user, 'rol', 'Usuario')
        return token


class UsuarioComunSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioComun
        fields = [
            'rnic', 'rni', 'nombre', 'fecha_inscripcion',
            'departamento', 'especialidad', 'celular', 'imagen',
            'registro_empleado', 'estado', 'certificaciones',
            'mail', 'rol'
        ]
        extra_kwargs = {'rni': {'write_only': True}}

    def create(self, validated_data):
        validated_data['rni'] = make_password(validated_data['rni'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'rni' in validated_data:
            validated_data['rni'] = make_password(validated_data['rni'])
        return super().update(instance, validated_data)
