from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import UsuarioAdmin, UsuarioComun
from rest_framework.exceptions import AuthenticationFailed


class MultiModelJWTAuthentication(JWTAuthentication):
    def get_user(self, validadted_token):
        # Buscar primero en UsuarioAdmin
        try:
            user_id = validadted_token['user_id']
            rol = validadted_token.get('rol', None)
        except UsuarioAdmin.DoesNotExist:
            raise AuthenticationFailed("Usuario no encontrado.")

        if rol == 'admin_ciudad' or rol == 'admin_general':
            try:
                return UsuarioAdmin.objects.get(id=user_id)
            except UsuarioAdmin.DoesNotExist:
                raise AuthenticationFailed("Usuario Admin no encontrado.")
        elif rol == 'Usuario':
            try:
                return UsuarioComun.objects.get(id=user_id)
            except UsuarioComun.DoesNotExist:
                raise AuthenticationFailed("Usuario Comun no encontrado.")
        else:
            return super().get_user(validadted_token)

        if not user.is_active:
            raise AuthenticationFailed("Usuario inactivo.")
        return user
